import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum BlockType {
  header = 'header',
  question = 'question',
  button = 'button',
  footer = 'footer',
}

export enum QuestionType {
  single = 'single',
  multi = 'multi',
  text = 'text',
}

export class QuizBlockDto {
  @ApiProperty({ type: String, enum: BlockType })
  @IsEnum(BlockType)
  @IsNotEmpty()
  type: BlockType;

  @ApiProperty({ type: Number })
  @IsInt()
  @IsOptional()
  order?: number | null;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  title?: string | null;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  text?: string | null;

  @ApiProperty({ type: String, enum: QuestionType })
  @IsEnum(QuestionType)
  @IsOptional()
  questionType?: QuestionType | null;

  @ApiProperty({ type: Object })
  @IsOptional()
  options?: Prisma.JsonValue | null;
}

export class CreateQuizDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: String, nullable: true })
  @ApiProperty()
  @IsDateString()
  @IsOptional()
  publishedAt?: string | null;

  @ApiProperty({ type: [QuizBlockDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizBlockDto)
  @IsOptional()
  blocks?: QuizBlockDto[];
}

export class UpdateQuizDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ type: String })
  @IsDateString()
  @IsOptional()
  publishedAt?: string | null;

  @ApiProperty({ type: [QuizBlockDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizBlockDto)
  @IsOptional()
  blocks?: QuizBlockDto[];
}
