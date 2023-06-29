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
import { GetUser } from 'src/auth/decorator';
import { CreateBookmarkDTO, EditBookmarkDTO } from './dto';
import { JwtGuard } from 'src/auth/guard';


@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  getBookmarks(@GetUser('id') userId: number) {
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
