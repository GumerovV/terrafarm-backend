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
import { AdminModule } from './admin/admin.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import * as path from 'path'
import * as process from 'process'

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getTypeOrmConfig,
		}),
		ServeStaticModule.forRoot({
			rootPath: path.join(process.cwd(), '/media'),
			serveRoot: '/media',
		}),
		UserModule,
		BasketModule,
		ProductModule,
		AuthModule,
		InfoModule,
		AdminModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
