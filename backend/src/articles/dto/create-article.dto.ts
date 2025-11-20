// src/articles/dto/create-article.dto.ts

import { IsString, IsNotEmpty, IsUrl, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class MultiLangDto {
  @IsString()
  ua: string;

  @IsString()
  en: string;
}

class ArticleBlockDto {
  @ValidateNested()
  @Type(() => MultiLangDto)
  title: MultiLangDto;

  @ValidateNested()
  @Type(() => MultiLangDto)
  description: MultiLangDto;
}

export class CreateArticleDto {
  @ValidateNested()
  @Type(() => MultiLangDto)
  title: MultiLangDto;

  @ValidateNested()
  @Type(() => MultiLangDto)
  description: MultiLangDto;

  @IsUrl()
  photo: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArticleBlockDto)
  blocks: ArticleBlockDto[];
}
