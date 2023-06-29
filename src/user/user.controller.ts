import { Body, Controller, Get, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { getUser } from "src/auth/decorator";
import { JwtGuard } from "src/auth/guard/jwt-guard";


@Controller('users')

export class UserController{
    @UseGuards(JwtGuard)
    @Get('single-user')
    getUser(
        @getUser() user: User){
        return user.email
    }
    
}
