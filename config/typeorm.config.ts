import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'

export const getTypeOrmConfig = async (
	configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
	type: 'postgres',
	host: 'db',
	port: configService.get('DB_PORT'),
	database: configService.get('DB_NAME'),
	username: configService.get('DB_USERNAME'),
	password: configService.get('DB_PASSWORD'),
	autoLoadEntities: true,
	synchronize: true,
})
