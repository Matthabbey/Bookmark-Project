import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, LoginDTO } from './dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
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
      if (error instanceof PrismaClientKnownRequestError) {
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
    return (this.signToken(user.id, user.email));
  }

  async signToken(
    userId: Number,
    email: string,
  ): Promise<{ access_token: string, message: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT-SECRET');
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: 'secret',
    });
    return {
        message: "Successful",
      access_token: token,
    };
  }
}
