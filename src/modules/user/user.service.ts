import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from '../role/role.repository';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { status } from '../../shared/entity-status.num';
import { ReadUserDto, UpdatedUserDto } from './dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
  ) {}

  async get(userId: number): Promise<ReadUserDto> {
    if (!userId) {
      throw new BadRequestException('id must be sent');
    }

    const user: User = await this._userRepository.findOne(userId, {
      where: { status: status.ACTIVE },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return plainToClass(ReadUserDto, user);
  }

  async getAll(): Promise<ReadUserDto[]> {
    const users: User[] = await this._userRepository.find({
      where: { status: status.ACTIVE },
    });

    if (!users) {
      throw new NotFoundException();
    }

    return users.map((user: User) => plainToClass(ReadUserDto, user));
  }

  // async create(user: User): Promise<User> {
  //   const details = new UserDetails();
  //   user.details = details;

  //   const repo = await getConnection().getRepository(Role);
  //   const defaultRole = await repo.findOne({ where: { name: 'GENERAL' } });
  //   user.roles = [defaultRole];

  //   const savedUser: User = await this._userRepository.save(user);

  //   if (!savedUser) {
  //     throw new NotFoundException();
  //   }

  //   return savedUser;
  // }

  async update(userId: number, user: UpdatedUserDto): Promise<ReadUserDto> {
    const foundUser = await this._userRepository.findOne(userId, {
      where: { status: status.ACTIVE },
    });

    if (!foundUser) {
      throw new NotFoundException('User does not exists');
    }

    foundUser.username = user.username;

    const updateUser = await this._userRepository.save(foundUser);

    return plainToClass(ReadUserDto, updateUser);
  }

  async delete(userId: number): Promise<void> {
    const userExists = await this._userRepository.findOne(userId, {
      where: { status: status.ACTIVE },
    });

    if (!userExists) {
      throw new NotFoundException();
    }
    await this._userRepository.update(userId, { status: 'INACTIVE' });
  }

  async setRoleToUser(userId: number, roleId: number): Promise<boolean> {
    const userExists = await this._userRepository.findOne(userId, {
      where: { status: status.ACTIVE },
    });

    if (!userExists) {
      throw new NotFoundException();
    }

    const roleExists = await this._roleRepository.findOne(roleId, {
      where: { status: status.ACTIVE },
    });

    if (!roleExists) {
      throw new NotFoundException('Role does not exist');
    }

    userExists.roles.push(roleExists);
    await this._userRepository.save(userExists);

    return true;
  }
}
