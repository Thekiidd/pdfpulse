import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { firebaseAuth } from '../firebase-admin.config';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Auth: No se encontró el token de seguridad. (Se requiere iniciar sesión)');
    }

    try {
      const decodedToken = await firebaseAuth.verifyIdToken(token);
      request['user'] = decodedToken;
      return true;
      
    } catch (error) {
      console.error('FirebaseAuthGuard Error:', error.message);
      throw new UnauthorizedException('Auth: Token inválido o expirado. Vuelve a iniciar sesión.');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}