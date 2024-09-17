import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Repository } from 'typeorm';
import { SwimlaneService } from 'src/swimlane/swimlane.service';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card) private cardRepository: Repository<Card>,
    private swimlaneService: SwimlaneService,
  ) {}

  async create(createCardDto: CreateCardDto, userId: number) {
    const new_card = new Card();
    new_card.name = createCardDto.name;
    new_card.content = createCardDto.content;
    new_card.order = createCardDto.order;
    new_card.swimlaneId = createCardDto.swimlaneId;

    const has_access_to_swimlane =
      await this.swimlaneService.hasAccessToSwimlane(
        createCardDto.swimlaneId,
        userId,
      );

    if (!has_access_to_swimlane) {
      throw new UnauthorizedException('You are not part of this card!!');
    }

    return this.cardRepository.save(new_card);
  }

  findAll() {
    return `This action returns all card`;
  }

  findOne(id: number) {
    return `This action returns a #${id} card`;
  }

  update(id: number, userId: number, updateCardDto: UpdateCardDto) {
    return this.cardRepository.update(
      {
        id,
        swimlane: {
          board: {
            users: {
              id: userId,
            },
          },
        },
      },
      {
        name: updateCardDto.name,
        content: updateCardDto.content,
      },
    );
  }

  remove(id: number, userId: number) {
    return this.cardRepository.delete({
      id,
      swimlane: {
        board: {
          users: {
            id: userId,
          },
        },
      },
    });
  }
}
