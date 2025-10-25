import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
	CreateReniecDto,
	ReniecDniRequestDataDto,
	ReniecDniRequestDto,
	ReniecDto,
} from './dtos';
import { Reniec } from 'src/database/entities/reniec.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from 'src/database';
import { CustomException } from 'src/common/models';
import { ErrorCode } from 'src/common/enums';

@Injectable()
export class ReniecService {
	constructor(
		@InjectRepository(Reniec)
		private readonly ReniecRepository: Repository<Reniec>,

		private httpService: HttpService,
		@InjectRepository(Patient)
		private readonly patientRepository: Repository<Patient>,
	) {}

	async getDniInfo(dniNumber: string) {
		try {
			console.log('getDniInfo() - service', dniNumber);

			const searchPatient = await this.patientRepository
				.createQueryBuilder('Patient')
				.where('Patient.numDocument = :numDocument', { numDocument: dniNumber })
				.andWhere('ROWNUM = 1') // Limitar a un solo resultado
				.getOne();

			console.log('searchPatient');
			console.log(searchPatient);
			if (searchPatient) {
				throw new CustomException(
					'El DNI ya existe en la base de datos',
					ErrorCode.PATIENT_DNI_ALREADY_EXISTS,
				);
			}
			const response = await firstValueFrom(
				this.httpService.get(`http://go.net.pe:3000/api/v2/dni/${dniNumber}`, {
					headers: {
						Authorization: 'Bearer pams_3uy1js7avc987sh',
						'Content-Type': 'application/json',
						'User-Agent': 'insomnia/10.3.1',
					},
					params: {
						dni: dniNumber,
					},
				}),
			);
			console.log(response.data);
			if (response.data.codigo === 0) {
				throw new CustomException(
					'Error con servicio de Reniec',
					ErrorCode.ERROR_TOKEN_RENIEC,
				);
			}

			return response.data;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
	async getNamesReniec(body: ReniecDniRequestDataDto): Promise<any> {
		try {
			const response = await firstValueFrom(
				this.httpService.post('http://go.net.pe:3000/api/v2/dninombres', body, {
					headers: {
						Authorization: 'Bearer pams_3uy1js7avc987sh',
						'Content-Type': 'application/json',
						'User-Agent': 'insomnia/10.3.1',
					},
				}),
			);
			return response.data;
		} catch (error) {
			throw new Error(`Error al consultar nombres: ${error.message}`);
		}
	}

	async createRegistro(createReniec: CreateReniecDto) {
		try {
			const menu = this.ReniecRepository.create(createReniec);
			return await this.ReniecRepository.save(menu);
		} catch (error) {
			console.error(error);
			throw new InternalServerErrorException('Error creating parameter');
		}
	}

	async findOne(dni: string) {
		const user = await this.ReniecRepository.createQueryBuilder('RENIEC')
			.where('RENIEC.dni = :dni', { dni })
			.getOne();

		// if(!user) {
		//     throw new NotFoundException('User not found');
		// }

		return user;
	}
	async findAll() {
		return await this.ReniecRepository.find();
	}
}
