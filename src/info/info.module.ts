import { Module } from '@nestjs/common'
import { InfoService } from './info.service'
import { InfoController } from './info.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../user/user.entity'
import { BasketEntity } from '../basket/basket.entity'
import { InfoEntity } from './info.entity'

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, BasketEntity, InfoEntity])],
	controllers: [InfoController],
	providers: [InfoService],
})
export class InfoModule {}
