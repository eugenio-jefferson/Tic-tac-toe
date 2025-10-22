const { IsString, IsNotEmpty, MinLength, MaxLength } = require('class-validator');

class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  username;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  password;
}

class LoginDto {
  @IsString()
  @IsNotEmpty()
  username;

  @IsString()
  @IsNotEmpty()
  password;
}

module.exports = { RegisterDto, LoginDto };

