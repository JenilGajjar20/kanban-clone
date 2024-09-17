import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  create(createUserDto: RegisterDto) {
    const new_user = new User();
    new_user.email = createUserDto.email;
    new_user.firstName = createUserDto.firstName;
    new_user.lastName = createUserDto.lastName;
    new_user.password = createUserDto.password;
    return this.userRepository.save(new_user);
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async isConnectedToBoard(id: number, boardId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
        boards: {
          id: boardId,
        },
      },
      relations: ['boards'],
    });

    if (!user) {
      throw new UnauthorizedException('You are not part of this board!!');
    }

    return true;
  }

  async isConnectedToSwimlane(id: number, swimlaneId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
        boards: {
          swimlanes: {
            id: swimlaneId,
          },
        },
      },
      relations: ['boards', 'boards.swimlanes'],
    });

    if (!user) {
      throw new UnauthorizedException('You are not part of this board!!');
    }

    return true;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, {
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
    });
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
