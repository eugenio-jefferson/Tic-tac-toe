const {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Inject,
} = require("@nestjs/common");
const { JwtService } = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const { UsersService } = require("../users/users.service");
const { LogsService } = require("../logs/logs.service");

@Injectable()
class AuthService {
  constructor(
    @Inject(UsersService) usersService,
    @Inject(JwtService) jwtService,
    @Inject(LogsService) logsService
  ) {
    this.usersService = usersService;
    this.jwtService = jwtService;
    this.logsService = logsService;
  }

  async register(registerDto) {
    try {
      const existingUser = await this.usersService.findByUsername(
        registerDto.username
      );
      if (existingUser) {
        throw new ConflictException("Username already exists");
      }

      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(
        registerDto.password,
        saltRounds
      );

      const user = await this.usersService.create({
        username: registerDto.username,
        password: hashedPassword,
      });

      await this.logsService.logEvent("USER_REGISTERED", {
        userId: user.id,
        username: user.username,
      });

      const payload = { sub: user.id, username: user.username };
      const token = await this.jwtService.signAsync(payload);

      return {
        access_token: token,
        user: {
          id: user.id,
          username: user.username,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      await this.logsService.logError("REGISTRATION_FAILED", error.message, {
        username: registerDto.username,
      });
      throw error;
    }
  }

  async login(loginDto) {
    try {
      const user = await this.usersService.findByUsername(loginDto.username);
      if (!user) {
        throw new UnauthorizedException("Invalid credentials");
      }

      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid credentials");
      }

      await this.usersService.updateOnlineStatus(user.id, true);

      await this.logsService.logEvent("USER_LOGIN", {
        userId: user.id,
        username: user.username,
      });

      const payload = { sub: user.id, username: user.username };
      const token = await this.jwtService.signAsync(payload);

      return {
        access_token: token,
        user: {
          id: user.id,
          username: user.username,
          isOnline: true,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      await this.logsService.logError("LOGIN_FAILED", error.message, {
        username: loginDto.username,
      });
      throw error;
    }
  }

  async logout(userId) {
    try {
      await this.usersService.updateOnlineStatus(userId, false);

      await this.logsService.logEvent("USER_LOGOUT", { userId });

      return { message: "Logged out successfully" };
    } catch (error) {
      await this.logsService.logError("LOGOUT_FAILED", error.message, {
        userId,
      });
      throw error;
    }
  }

  async validateUser(payload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    return user;
  }
}

module.exports = { AuthService };
