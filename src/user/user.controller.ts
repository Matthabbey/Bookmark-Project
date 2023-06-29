import { Body, Controller, Get, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { getUser } from "src/auth/decorator";
import { JwtGuard } from "src/auth/guard/jwt-guard";


@UseGuards(JwtGuard)
@Controller('users')

export class UserController{
    @HttpCode(HttpStatus.OK)
    @Get('single-user')
    getUser(
        @getUser() user: User){
        console.log(user)
    }
    
}
