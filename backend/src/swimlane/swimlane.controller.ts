import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SwimlaneService } from './swimlane.service';
import { CreateSwimlaneDto } from './dto/create-swimlane.dto';
import { UpdateSwimlaneDto } from './dto/update-swimlane.dto';
import { AuthGuard, PayloadRequest } from 'src/auth/auth/auth.guard';

@Controller('swimlane')
export class SwimlaneController {
  constructor(private readonly swimlaneService: SwimlaneService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createSwimlaneDto: CreateSwimlaneDto,
    @Request() req: PayloadRequest,
  ) {
    return this.swimlaneService.create(createSwimlaneDto, req.user.id);
  }

  @Get('/board/:boardId')
  @UseGuards(AuthGuard)
  findAll(@Param('boardId') boardId: number, @Request() req: PayloadRequest) {
    return this.swimlaneService.findSwimlaneByBoardId(
      Number(boardId),
      req.user.id,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.swimlaneService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateSwimlaneDto: UpdateSwimlaneDto,
    @Request() req: PayloadRequest,
  ) {
    return this.swimlaneService.update(+id, updateSwimlaneDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Request() req: PayloadRequest) {
    return this.swimlaneService.remove(+id, req.user.id);
  }
}
