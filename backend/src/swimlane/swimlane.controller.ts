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
  Put,
} from '@nestjs/common';
import { SwimlaneService } from './swimlane.service';
import { CreateSwimlaneDto } from './dto/create-swimlane.dto';
import { UpdateSwimlaneDto } from './dto/update-swimlane.dto';
import { AuthGuard, PayloadRequest } from 'src/auth/auth/auth.guard';
import { ReorderSwimlaneDto } from './dto/reorder-swimlane.dto';

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

  @Put('update-order')
  @UseGuards(AuthGuard)
  updateOrder(
    @Body() reorderSwimlanes: ReorderSwimlaneDto,
    @Request() req: PayloadRequest,
  ) {
    return this.swimlaneService.updateSwimlaneOrders(
      reorderSwimlanes,
      req.user.id,
    );
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
