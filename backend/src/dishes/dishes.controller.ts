import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  Req,
  UseGuards,
  ForbiddenException,
  ParseIntPipe,
} from '@nestjs/common';
import { DishesService } from './dishes.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../users/dto/create-user.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}


    @Get('all')
async getAllDishes(
  @Query('query') searchQuery?: string,
  @Query('category') category?: string,
) {
  return this.dishesService.getAllDishes(searchQuery, category);
}


  // ----------------------------------------
  // Коментарі
  // ----------------------------------------
  @UseGuards(AuthGuard('jwt'))
  @Get('comments')
  async findAllComments(@Req() req) {
    const user = req.user as { role: UserRole };
    if (user.role !== 'admin') {
      throw new ForbiddenException(
        'Тільки адміністратори можуть отримати доступ до цієї інформації.',
      );
    }
    return this.dishesService.getAllComments();
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('comment/:id')
  async deleteComment(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user = req.user as { id: string; role: UserRole };
    const comment = await this.dishesService.getCommentById(id);

    if (!comment) {
      throw new ForbiddenException('Коментар не знайдено');
    }

    if (comment.user_id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('Ви не можете видалити цей коментар.');
    }

    return this.dishesService.deleteComment(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('comment')
  async addComment(@Body() createCommentDto: CreateCommentDto, @Req() req) {
    const userId = req.user.id;
    return this.dishesService.addComment({
      ...createCommentDto,
      user_id: userId,
    });
  }

  // ----------------------------------------
  // Вибрані страви
  // ----------------------------------------
  @Get('selected')
  async getSelectedDishes() {
    return this.dishesService.getSelectedDishes();
  }

  // ----------------------------------------
  // CRUD для страв
  // ----------------------------------------
  @Post()
  async create(@Body() createDishDto: CreateDishDto) {
    return this.dishesService.createDish(createDishDto);
  }

  @Get()
  async findAll(@Query() query: PaginationQueryDto) {
    const {
      page,
      limit,
      is_selected,
      query: searchQuery,
      category,
      ingredients,
    } = query;

    const isSelectedBool =
      is_selected === 'true'
        ? true
        : is_selected === 'false'
        ? false
        : undefined;

    let processedIngredients: string[] | undefined;

    if (ingredients) {
      if (Array.isArray(ingredients)) {
        processedIngredients = ingredients;
      } else if (typeof ingredients === 'string') {
        processedIngredients = [ingredients];
      }
    }

    return this.dishesService.getPaginatedDishes(
      page,
      limit,
      searchQuery,
      category,
      processedIngredients,
      isSelectedBool,
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dishesService.getDishById(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDishDto: UpdateDishDto) {
    return this.dishesService.updateDish(id, updateDishDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.dishesService.deleteDish(id);
  }

  @Patch(':id/select')
  async select(@Param('id', ParseIntPipe) id: number) {
    return this.dishesService.selectDish(id);
  }

  @Patch(':id/unselect')
  async unselect(@Param('id', ParseIntPipe) id: number) {
    return this.dishesService.unselectDish(id);
  }
  


}
