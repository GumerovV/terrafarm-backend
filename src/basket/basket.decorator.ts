import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserEntity } from '../user/user.entity'

export const CurrentUser = createParamDecorator(
	(data: keyof UserEntity, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest()
		const user = req.user

		return data ? user[data] : user
	},
)
