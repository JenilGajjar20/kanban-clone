import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface PayloadRequest extends Request {
  user: { id: number; email: string };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Unauthorized Access!');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized access!!');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    console.log('request: ', request);
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      return undefined;
    }

    return authHeader.split(' ')[1];
  }
}
