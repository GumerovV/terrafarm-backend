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
import { MailerModule } from '@nestjs-modules/mailer'

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
		MailerModule.forRoot({
			transport: {
				host: process.env.SMTP_HOST,
				auth: {
					user: process.env.SMTP_USER,
					pass: process.env.SMTP_PASSWORD,
				},
			},
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
