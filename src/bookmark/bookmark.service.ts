import { GetUser } from 'src/auth/decorator';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDTO, EditBookmarkDTO } from './dto';

export class BookmarkService {
  constructor(private readonly prisma: PrismaService) {}

  public async createBookmark(userId: number, dto: CreateBookmarkDTO) {
    // console.log("here now", this.prisma.bookmark)
try {
  
  const bookmark = await this.prisma.bookmark.create({
    data: {
      userId,
      ...dto,
    },
  });
  return { message: 'Successful', bookmark};
} catch (error) {
  return error
}
  }

  public async getBookmarks(userId: number ) {
    try {
      console.log("result", "bookmark" )
      const bookmark = await this.prisma.bookmark.findMany({
        where: {
          userId,
        },
      });
      return bookmark
    } catch (error) {
      console.log(error)
      return {message: error}
    }
  }

  public async getBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }

  public async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDTO,
  ) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    if (!bookmark || bookmark.userId !== userId) {
      return { error: 'Access to resources denied' };
    }
    const result = await this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
    return { message: 'Successfully updated', result };
  }

  public async deleteBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    if (!bookmark || bookmark.userId !== userId) {
      return { error: 'Access to resources denied' };
    }
    const result = await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
    return { message: 'Successfully deleted this bookmark' };
  }
}
