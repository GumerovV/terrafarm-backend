import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BasketEntity } from '../basket/basket.entity'

@Module({
	imports: [TypeOrmModule.forFeature([BasketEntity])],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {}
