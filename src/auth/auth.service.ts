import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto, LoginDTO } from './dto';
import * as argon from 'argon2';
import { JwtStrategy } from './strategy/jwt-strategy';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtStrategy: JwtStrategy
  ) {}

  async signup(signupDTO: AuthDto) {
    const hash = await argon.hash(signupDTO.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: signupDTO.email,
          hash,
          lastName: signupDTO.lastName,
          firstName: signupDTO.firstName,
        },
      });
      return { message: 'Successful', user };
    } catch (error) {
      if (error) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials Taken');
        }
      }
      throw error;
    }
  }

  async login(loginDTO: LoginDTO) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDTO.email },
    });
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const comparePassword = await argon.verify(user.hash, loginDTO.password);
    if (!comparePassword) {
      throw new ForbiddenException('Invalid password');
    }
    return (this.jwtStrategy.signToken(user.id, user.email));
  }

}
