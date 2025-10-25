import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParameterType } from 'src/database';
import { DataSource, Repository } from 'typeorm';
import { CreateParameterTypesDto } from './dtos/create-parameter-types.dto';
import { UpdateParameterTypesDto } from './dtos/update-parameter-types.dto';

@Injectable()
export class ParameterTypesService {
	constructor(
		@InjectRepository(ParameterType)
		private readonly parameterTypeRepository: Repository<ParameterType>,
		private readonly dataSource: DataSource,
	) {}

	async getParameterTypes() {
		return await this.parameterTypeRepository
			.createQueryBuilder('parameterType')
			.leftJoinAndSelect('parameterType.parameters', 'parameters')
			.getMany();
	}

	async getParameterTypeById(id: string) {
		const parameter = await this.parameterTypeRepository
			.createQueryBuilder('parameterType')
			.leftJoinAndSelect('parameterType.parameters', 'parameters')
			.where('parameterType.id = :id', { id })
			.getOne();

		if (!parameter) {
			throw new NotFoundException('ParameterType not found');
		}

		return parameter;
	}

	async createParameterType(createParameterType: CreateParameterTypesDto) {
		try {
			const parameterType =
				this.parameterTypeRepository.create(createParameterType);
			return await this.parameterTypeRepository.save(parameterType);
		} catch (error) {
			console.log(error);
		}
	}

	async updateParameterType(
		id: string,
		updateParameterType: UpdateParameterTypesDto,
	) {
		await this.getParameterTypeById(id);

		const parameterType = await this.parameterTypeRepository.preload({
			id: id,
			...updateParameterType,
		});

		return await this.parameterTypeRepository.save(parameterType);
	}

	async deleteParameterType(id: string) {
		const parameterType = await this.getParameterTypeById(id);

		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			await queryRunner.manager
				.createQueryBuilder()
				.relation(ParameterType, 'parameters')
				.of(parameterType)
				.remove(parameterType.parameters);

			await queryRunner.manager
				.createQueryBuilder()
				.delete()
				.from(ParameterType)
				.where('id = :id', { id })
				.execute();

			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		} finally {
			await queryRunner.release;
		}
	}
}
