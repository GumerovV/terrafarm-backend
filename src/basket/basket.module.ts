import { Module } from '@nestjs/common'
import { BasketService } from './basket.service'
import { BasketController } from './basket.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../user/user.entity'
import { ProductEntity } from '../product/product.entity'
import { BasketItemEntity } from './basketItem.entity'
import { BasketEntity } from './basket.entity'
import { InfoEntity } from '../info/info.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([
			UserEntity,
			ProductEntity,
			BasketItemEntity,
			BasketEntity,
			InfoEntity,
		]),
	],
	controllers: [BasketController],
	providers: [BasketService],
})
export class BasketModule {}
