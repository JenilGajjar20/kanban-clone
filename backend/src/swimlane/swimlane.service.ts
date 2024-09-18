import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateSwimlaneDto } from './dto/create-swimlane.dto';
import { UpdateSwimlaneDto } from './dto/update-swimlane.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Swimlane } from './entities/swimlane.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { ReorderSwimlaneDto } from './dto/reorder-swimlane.dto';

@Injectable()
export class SwimlaneService {
  constructor(
    @InjectRepository(Swimlane)
    private swimlaneRepository: Repository<Swimlane>,
    private userService: UserService,
  ) {}

  async create(createSwimlaneDto: CreateSwimlaneDto, userId: number) {
    const new_swimlane = new Swimlane();
    new_swimlane.name = createSwimlaneDto.name;
    new_swimlane.order = createSwimlaneDto.order;
    new_swimlane.boardId = createSwimlaneDto.boardId;

    await this.userService.isConnectedToBoard(userId, new_swimlane.boardId);
    return this.swimlaneRepository.save(new_swimlane);
  }

  async updateSwimlaneOrders(reorder: ReorderSwimlaneDto, userId: number) {
    await this.userService.isConnectedToBoard(userId, reorder.boardId);

    const promises = reorder.items.map((swimlane) => {
      this.swimlaneRepository.update(swimlane.id, { order: swimlane.order });
    });
    await Promise.all(promises);

    return true;
  }

  async hasAccessToSwimlane(swimlaneId: number, userId: number) {
    const has_access = await this.swimlaneRepository.count({
      where: { id: swimlaneId, board: { users: { id: userId } } },
    });

    return has_access > 0;
  }

  findSwimlaneByBoardId(boardId: number, userId: number) {
    return this.swimlaneRepository.find({
      where: { boardId, board: { users: { id: userId } } },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} swimlane`;
  }

  async update(
    id: number,
    updateSwimlaneDto: UpdateSwimlaneDto,
    userId: number,
  ) {
    await this.userService.isConnectedToBoard(
      userId,
      updateSwimlaneDto.boardId,
    );

    return this.swimlaneRepository.update(id, {
      name: updateSwimlaneDto.name,
    });
  }

  async remove(id: number, userId: number) {
    await this.userService.isConnectedToSwimlane(userId, id);
    return this.swimlaneRepository.delete(id);
  }
}
