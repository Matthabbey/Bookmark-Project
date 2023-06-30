import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator';
import { CreateBookmarkDTO, EditBookmarkDTO } from './dto';
import { JwtGuard } from '../auth/guard';
import { User } from '@prisma/client';


@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @HttpCode(HttpStatus.OK)
  @Get('all')
  getBookmarks(@GetUser() userId: any
  ) {
    console.log(userId)
    return this.bookmarkService.getBookmarks(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getBookmarksById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.getBookmarkById(userId, bookmarkId);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  createBookmark(
    @GetUser('id') userId: number,
    @Body() dto: CreateBookmarkDTO,
  ) {
    this.bookmarkService.createBookmark(userId, dto);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id')
  updateBookmark(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: EditBookmarkDTO,
  ) {
    this.bookmarkService.editBookmarkById(userId, bookmarkId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookmark(
    @GetUser(':id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.deleteBookmarkById(userId, bookmarkId);
  }
}
