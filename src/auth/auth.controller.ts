import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RegisterDto, LoginDto } from './auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Créer un nouveau compte' })
  register(@Body() body: RegisterDto) {
    return this.authService.register(body.name, body.email, body.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Se connecter et obtenir un token JWT' })
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }
}