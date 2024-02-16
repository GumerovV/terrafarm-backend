import { IsPhoneNumber, IsString } from 'class-validator'

export class InfoDto {
	@IsString()
	name: string

	@IsString()
	surname: string

	@IsString()
	country: string

	@IsString()
	city: string

	@IsString()
	street: string

	@IsString()
	building: string

	@IsString()
	apartment: string

	@IsPhoneNumber('RU', { message: 'Некорректный номер телефона!' })
	number: string
}
