import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  LoggerService,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, Specialty, User } from 'src/database/entities';
import { DataSource, Repository } from 'typeorm';
import { changePasswordDto, CreateUserDto } from './dtos';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CustomException } from 'src/common/models';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { BaseService } from 'src/common/services/base-service.service';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    public readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    public readonly roleRepository: Repository<Role>,

    @InjectRepository(Specialty)
    public readonly specialtyRepository: Repository<Specialty>,

    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    public readonly logger: LoggerService,

    private readonly dataSource: DataSource,
  ) {
    super(userRepository, logger);
  }

  // 🔹 Crear usuario
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, roles, specialties , ...userData } = createUserDto;

      // Verificar duplicado
      const existingUser = await this.userRepository
        .createQueryBuilder('user')
        .where('user.numdocument = :numdocument', {
          numdocument: userData.numdocument,
        })
        .andWhere('user.typedocument = :typedocument', {
          typedocument: userData.typedocument,
        })
        .getOne();

      if (existingUser) {
        throw new CustomException(
          'Ya existe un usuario con el mismo número de documento',
        );
      }

      // Roles y especialidades
      const rolesEntities = await this.getRolesEntities(roles);

      const specialtiesEntities = specialties ?.length
        ? await this.specialtyRepository.find({
            where: specialties.map((id) => ({ id })),
          })
        : [];

      const user = this.userRepository.create({
        ...userData,
        fullname: `${userData.names} ${userData.lastname} ${userData.motherlastname}`,
        password: await bcrypt.hash(password, 10),
        isactive: userData.isactive === true,
        roles: rolesEntities,
        specialties: specialtiesEntities,
      });

      await this.userRepository.save(user);
      delete user.password;

      return user;
    } catch (error) {
      this.logger.error('Error creating user', error);
      throw error;
    }
  }

  // 🔹 Actualizar usuario
  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'roles')
        .leftJoinAndSelect('user.specialties', 'specialties')
        .where('user.id = :id', { id })
        .getOne();

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      const { roles, specialties , ...userData } = updateUserDto;

      // Roles
      if (roles) {
        user.roles =
          roles.length > 0
            ? await this.getRolesEntities(roles)
            : [];
      }

      // Especialidades
      if (specialties ) {
        user.specialties =
          specialties .length > 0
            ? await this.specialtyRepository.find({
                where: specialties .map((id) => ({ id })),
              })
            : [];
      }

      // Nombre completo
      if (userData.names || userData.lastname || userData.motherlastname) {
        user.fullname = `${userData.names || user.names} ${
          userData.lastname || user.lastname
        } ${userData.motherlastname || user.motherlastname}`;
      }

      Object.assign(user, userData);

      const updatedUser = await this.userRepository.save(user);
      delete updatedUser.password;

      this.logger.log(`User updated successfully: ${id}`, 'UserService');
      return updatedUser;
    } catch (error) {
      this.logger.error(
        `Error updating user ${id}: ${error.message}`,
        error.stack,
        'UserService',
      );
      this.handleDatabaseError(error);
    }
  }

  // 🔹 Listar usuarios (roles + especialidades)
  async findAll(page = 1, limit = 10, search = '') {
    try {
      const tableName = `${this.repository.metadata.tableName}`; // "users"

      const customQuery = `
        SELECT
          u.id,
          u.numdocument,
          u.typedocument,
          u.isactive,
          u.names,
          u.lastname,
          u.motherlastname,
          u.fullname,
          u.createdat,
          u.updatedat,
          (
            SELECT COALESCE(
              '[' || STRING_AGG(
                CONCAT(
                  '{"id":"', r.id,
                  '","name":"', REPLACE(r.name, '"', '\\"'),
                  '","description":"', REPLACE(COALESCE(r.description, ''), '"', '\\"'),
                  '"}'
                ),
                ',' ORDER BY r.name
              ) || ']',
              '[]'
            )
            FROM users_roles ur
            JOIN roles r ON r.id = ur.roleid
            WHERE ur.userid = u.id
          ) AS roles,
          (
            SELECT COALESCE(
              '[' || STRING_AGG(
                CONCAT(
                  '{"id":"', s.id,
                  '","description":"', REPLACE(s.description, '"', '\\"'),
                  '"}'
                ),
                ',' ORDER BY s.description
              ) || ']',
              '[]'
            )
            FROM users_specialties us
            JOIN specialties s ON s.id = us.specialtyid
            WHERE us.userid = u.id
          ) AS specialties
        FROM ${tableName} u
        ORDER BY u.id
      `;

      const result = await this.paginate({ page, limit, search, customQuery });

      const data = result.data.map((row: any) => ({
        ...row,
        roles: typeof row.roles === 'string' ? JSON.parse(row.roles) : [],
        specialties:
          typeof row.specialties === 'string'
            ? JSON.parse(row.specialties)
            : [],
      }));

      return { data, meta: result.meta };
    } catch (error) {
      this.logger.error('Error finding all users', error);
      throw error;
    }
  }

  // 🔹 Buscar por documento
  async findByDocument(numDocument: string) {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('users.numdocument = :numDocument', { numDocument })
      .getOne();

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // 🔹 Buscar por ID
  async findOne(id: string) {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .innerJoinAndSelect('users.roles', 'roles')
      .leftJoinAndSelect('users.specialties', 'specialties')
      .where('users.id = :id', { id })
      .getOne();

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // 🔹 Cambiar contraseña
  async changePassword(id: string, password: changePasswordDto) {
    const user = await this.userRepository
      .createQueryBuilder('USERS')
      .where('USERS.id = :id', { id })
      .getOne();

    if (!user) throw new NotFoundException('User not found');

    user.password = await bcrypt.hash(password.password, 10);
    return this.userRepository.save(user);
  }

  // 🔹 Usuarios con especialidad
  async getUserXSpecialty() {
    try {
      let users = await this.userRepository.find({
        relations: ['specialties'],
      });
      return users.filter((user) => user.specialties.length > 0);
    } catch (error) {
      this.logger.error('Error finding users with specialties', error);
      throw error;
    }
  }

  // 🔹 Roles helper
  private async getRolesEntities(roles: string[]): Promise<Role[]> {
    if (!roles || roles.length === 0) {
      throw new BadRequestException('Roles are required');
    }

    const rolesEntities = await this.roleRepository.find({
      where: roles.map((id) => ({ id })),
    });

    if (rolesEntities.length === 0) {
      throw new NotFoundException('Roles not found');
    }

    return rolesEntities;
  }

  // 🔹 Manejador de errores
  private handleDatabaseError(error: any): never {
    this.logger.error('Database error', error);
    if (
      error instanceof NotFoundException ||
      error instanceof BadRequestException ||
      error instanceof ConflictException
    ) {
      throw error;
    } else {
      throw new InternalServerErrorException(
        `Database error: ${error.message}`,
      );
    }
  }
}
