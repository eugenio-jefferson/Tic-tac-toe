const { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } = require('@nestjs/common');
const { JwtService } = require('@nestjs/jwt');

@Injectable()
class JwtAuthGuard {
  constructor(@Inject(JwtService) jwtService) {
    this.jwtService = jwtService;
  }

  async canActivate(context) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    
    return true;
  }

  extractTokenFromHeader(request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

module.exports = { JwtAuthGuard };

