import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parameter, ParameterType } from 'src/database';
import { Repository } from 'typeorm';
import { CreateParameterDto } from './dtos/create-parameter.dto';
import { UpdateParameterDto } from './dtos/update-parameter.dto';

@Injectable()
export class ParameterService {
	constructor(
		@InjectRepository(Parameter)
		private readonly parameterRepository: Repository<Parameter>,
		@InjectRepository(ParameterType)
		private readonly parameterTypeRepository: Repository<ParameterType>,
	) {}

	getParameters() {
		return this.parameterRepository.find({
			relations: ['parametertype'],
		});
	}

	getParameterById(id: string) {
		const parameter = this.parameterRepository
			.createQueryBuilder('parameter')
			.leftJoinAndSelect('parameter.parametertype', 'parametertype')
			.where('parameter.id = :id', { id })
			.getOne();

		if (!parameter) {
			throw new NotFoundException('Parameter not found');
		}

		return parameter;
	}

	async createParameter(createParameter: CreateParameterDto) {
		try {
			const { parametertypeid, ...parameterData } = createParameter;

			const parameterType = await this.parameterTypeRepository
				.createQueryBuilder('parametertype')
				.where('parametertype.id = :id', { id: parametertypeid })
				.getOne();
			if (!parameterType) {
				throw new NotFoundException(
					`ParameterType with id ${parametertypeid} not found`,
				);
			}

			const parameter = this.parameterRepository.create({
				...parameterData,
				parametertype: parameterType,
			});

			return await this.parameterRepository.save(parameter);
		} catch (error) {
			console.error(error);
			throw new InternalServerErrorException('Error creating parameter');
		}
	}

	async updateParameter(id: string, updateParameter: UpdateParameterDto) {
		this.getParameterById(id);

		const { parametertypeid, ...update } = updateParameter;

		const parameterType = await this.parameterTypeRepository
			.createQueryBuilder('parametertype')
			.where('parametertype.id = :id', { id: parametertypeid })
			.getOne();

		const parameter = await this.parameterRepository.preload({
			id: id,
			...update,
			parametertype: parameterType,
		});

		return await this.parameterRepository.save(parameter);
	}

	async deleteParameter(id: string) {
		const parameter = await this.getParameterById(id);

		if (!parameter) {
			throw new NotFoundException('Parameter not found');
		}

		return await this.parameterRepository.remove(parameter);
	}
}
