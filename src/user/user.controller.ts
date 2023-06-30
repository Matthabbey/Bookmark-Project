import { Body, Controller, Get, HttpCode, HttpStatus, Patch, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { GetUser } from "../auth/decorator";
import { JwtGuard } from "../auth/guard";
import { EditUserDto } from "./dto";
import { UserService } from "./user.service";



@UseGuards(JwtGuard)
@Controller('users')

export class UserController{
    constructor(private readonly userService: UserService){}
    @HttpCode(HttpStatus.OK)
    @Get('single-user')
    GetUser(
        @GetUser() user: User){
        console.log(user, "here")
    }

    @Patch('update')
    editUser(
      @GetUser('id') userId: number,
      @Body() dto: EditUserDto,
    ) {
      return this.userService.editUser(userId, dto);
    }
    
}
