
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly config: ConfigService,
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService
        
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('JWT_SECRET')
        })

    }
async validate(payload: {sub: number, email: string}){
    const user = await this.prisma.user.findUnique({
        where : {email: payload.email}
    })
    if(!user){
        return { message: "Unauthorized user"}
    }
    return user
}

 public async signToken(
    userId: Number,
    email: string,
  ): Promise<{ access_token: string, message: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get("JWT_SECRET"),
    });
    return {
        message: "Successful",
      access_token: token,
    };
  }
}