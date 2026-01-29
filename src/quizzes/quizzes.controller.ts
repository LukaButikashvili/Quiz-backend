import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto, UpdateQuizDto } from './dto/quizzes.dto';

@Controller('quizzes')
export class QuizzesController {
  constructor(private quizzesService: QuizzesService) {}

  @Get()
  getAllQuizzes() {
    return this.quizzesService.getAll();
  }

  @Get(':id')
  getQuizById(@Param('id', ParseUUIDPipe) id: string) {
    return this.quizzesService.getById(id);
  }

  @Post()
  createQuiz(@Body() dto: CreateQuizDto) {
    return this.quizzesService.create({
      title: dto.title,
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : null,
      blocks: dto.blocks,
    });
  }

  @Put(':id')
  updateQuiz(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateQuizDto,
  ) {
    return this.quizzesService.update({
      id,
      title: dto.title,
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
      blocks: dto.blocks,
    });
  }

  @Post(':id/publish')
  publishQuiz(@Param('id', ParseUUIDPipe) id: string) {
    return this.quizzesService.publish(id);
  }
}
