import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO, LoginUserDTO } from './auth.dto';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Create a new account' })
  @Post('register')
  async register(@Body() body: CreateUserDTO) {
    const newUser = await this.authService.register(body);
    return {
      data: {
        type: 'users',
        id: newUser.id,
        attributes: {
          ...newUser,
        },
        links: {
          self: `/v1/users/${newUser.id}`,
        },
      },
    };
  }

  @ApiOperation({ summary: 'Login with your details' })
  @Post('login')
  async login(@Body() body: LoginUserDTO) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }
}
