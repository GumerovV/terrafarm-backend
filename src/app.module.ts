import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { getTypeOrmConfig } from '../config/typeorm.config'
import { UserModule } from './user/user.module'
import { BasketModule } from './basket/basket.module'
import { ProductModule } from './product/product.module'
import { AuthModule } from './auth/auth.module'
import { InfoModule } from './info/info.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getTypeOrmConfig,
		}),
		UserModule,
		BasketModule,
		ProductModule,
		AuthModule,
		InfoModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
