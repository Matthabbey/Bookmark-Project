import { describe } from 'node:test';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { CreateBookmarkDTO } from 'src/bookmark/dto';
import { EditUserDto } from 'src/user/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });
  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'matt03@gmail.com',
      password: '1234567890',
      lastName: '',
      firstName: '',
    };
    describe('Signup', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body is provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
          .inspect();
      });
    });

    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/login').expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({email: dto.email, password: dto.password})
          .expectStatus(201)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/single-user')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          email: 'matt03@gmail.com',
          lastName: '',
          firstName: '',
        };
        return pactum
          .spec()
          .patch('/users/update')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.email)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.lastName)
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Get empty bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks/single')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });
    describe('Create bookmark', () => {
      const dto: CreateBookmarkDTO = {
        title: 'First Bookmark',
        link: 'https://www.youtube.com/watch?v=d6WC5n9G_sM',
        description: ''
      };
      it('should create bookmark', () => {
        return pactum
          .spec()
          .post('/bookmarks/create')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });
    });
  //   describe('Get bookmarks', () => {
  //     it('should get bookmarks', () => {
  //       return pactum
  //         .spec()
  //         .get('/bookmarks')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .expectStatus(200)
  //         .expectJsonLength(1);
  //     });
  //   });
  //   describe('Get bookmark by id', () => {
  //     it('should get bookmark by id', () => {
  //       return pactum
  //         .spec()
  //         .get('/bookmarks/{id}')
  //         .withPathParams('id', '$S{bookmarkId}')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .expectStatus(200)
  //         .expectBodyContains('$S{bookmarkId}');
  //     });
  //   })
  //   describe('Edit bookmark by id', () => {
  //     const dto: CreateBookmarkDTO = {
  //       title: 'Kubernetes Course - Full Beginners Tutorial (Containerize Your Apps!)',
  //       description: 'Learn how to use Kubernetes in this complete course. Kubernetes makes it possible to containerize applications and simplifies app deployment to production.',
  //       link: ''
  //     };
  //     it('should edit bookmark', () => {
  //       return pactum
  //         .spec()
  //         .patch('/bookmarks/{id}')
  //         .withPathParams('id', '$S{bookmarkId}')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .withBody(dto)
  //         .expectStatus(200)
  //         .expectBodyContains(dto.title)
  //         .expectBodyContains(dto.description);
  //     });
  //   });

  //  describe('Delete bookmark by id', () => {
  //     it('should delete bookmark', () => {
  //       return pactum
  //         .spec()
  //         .delete('/bookmarks/{id}')
  //         .withPathParams('id', '$S{bookmarkId}')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .expectStatus(204);
  //     });
  //     it('should get empty bookmarks', () => {
  //       return pactum
  //         .spec()
  //         .get('/bookmarks')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .expectStatus(200)
  //         .expectJsonLength(0);
  //     });
  //   });
  // });
});
})