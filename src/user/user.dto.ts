import { IsOptional, IsPhoneNumber, IsString } from 'class-validator'

export class UserDto {
	@IsString()
	@IsOptional()
	name: string

	@IsString()
	@IsOptional()
	surname: string

	@IsString()
	@IsOptional()
	country: string

	@IsString()
	@IsOptional()
	city: string

	@IsString()
	@IsOptional()
	street: string

	@IsString()
	@IsOptional()
	building: string

	@IsString()
	@IsOptional()
	apartment: string

	@IsPhoneNumber('RU', { message: 'Некорректный номер телефона!' })
	@IsOptional()
	number: string
}
