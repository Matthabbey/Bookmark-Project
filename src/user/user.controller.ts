import { Body, Controller, Get, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { getUser } from "../auth/decorator";
import { JwtGuard } from "../auth/guard";



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
