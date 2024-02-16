import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../auth/decorators/auth.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<string[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()],
		)
		if (!requiredRoles) {
			return true
		}
		const { user } = context.switchToHttp().getRequest()

		if (!requiredRoles.includes(user?.role))
			throw new UnauthorizedException(
				'Необходимо обладать правами администратора!',
			)

		return true
	}
}
