import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        return this.hasAccess(user.role, requiredRoles);
    }

    private hasAccess(userRole: string, requiredRoles: string[]): boolean {
        const hierarchy = ['User', 'Teacher', 'Admin'];

        const userIndex = hierarchy.indexOf(userRole);
        return requiredRoles.some(role => userIndex >= hierarchy.indexOf(role));
    }
}
