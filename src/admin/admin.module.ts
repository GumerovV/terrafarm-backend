import { Module } from '@nestjs/common'
import { AdminService } from './admin.service'
import { AdminController } from './admin.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BasketEntity } from '../basket/basket.entity'

@Module({
	imports: [TypeOrmModule.forFeature([BasketEntity])],
	controllers: [AdminController],
	providers: [AdminService],
})
export class AdminModule {}
