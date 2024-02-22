import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BasketEntity } from '../basket/basket.entity'
import { InfoEntity } from '../info/info.entity'
import { UserEntity } from './user.entity'

@Module({
	imports: [TypeOrmModule.forFeature([BasketEntity, InfoEntity, UserEntity])],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {}
