const { Injectable, Inject } = require("@nestjs/common");
const { PassportStrategy } = require("@nestjs/passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const { AuthService } = require("./auth.service");

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(AuthService) authService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || "your-super-secret-jwt-key-here",
    });
    this.authService = authService;
  }

  async validate(payload) {
    return await this.authService.validateUser(payload);
  }
}

module.exports = { JwtStrategy };
