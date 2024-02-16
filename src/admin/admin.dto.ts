import { IsEnum, IsOptional } from 'class-validator'

export enum EnumOrderStatus {
	PROCESS = 'PROCESS',
	RECEIVED = 'RECEIVED',
}

export class GetAllOrdersDto {
	@IsOptional()
	@IsEnum(EnumOrderStatus)
	searchTerm?: EnumOrderStatus
}
