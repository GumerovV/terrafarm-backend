import { IsEnum, IsOptional } from 'class-validator'

export enum EnumOrderStatus {
	PROCESS = 'PROCESS',
	RECEIVED = 'RECEIVED',
	NULL = '',
}

export class GetAllOrdersDto {
	@IsOptional()
	@IsEnum(EnumOrderStatus)
	searchTerm?: EnumOrderStatus
}
