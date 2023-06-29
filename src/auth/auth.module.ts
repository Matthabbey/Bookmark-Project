import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Module({
    providers: [AuthService, PrismaService, JwtService, ConfigService],
    controllers: [AuthController],
    imports: []
})

export class AuthModule{}