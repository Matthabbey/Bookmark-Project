import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    providers: [PrismaService, BookmarkService],
    controllers: [BookmarkController]
})
export class BookmarkModule {}
