import { Module } from '@nestjs/common';
import { UserController } from './user.controller';

@Module({
    providers: [],
    imports: [],
    controllers: [UserController]
})

export class UserModule {}
