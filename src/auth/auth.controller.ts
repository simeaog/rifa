import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('enter')
  async enter(@Body() body: { whatsapp: string; nome?: string }) {
    // Validações (format whatsapp) e criação/lookup do usuário
    return this.authService.enter(body.whatsapp, body.nome);
  }
}
