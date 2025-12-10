import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma.service';
import { RifaController } from './rifas/rifa.controller';
import { RifaService } from './rifas/rifa.service';
import { NumeroController } from './numeros/numero.controller';
import { NumeroService } from './numeros/numero.service';

@Module({
  imports: [],
  controllers: [AuthController, RifaController, NumeroController],
  providers: [AuthService, PrismaService, RifaService, NumeroService],
})
export class AppModule {}
