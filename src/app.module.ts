import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma.service';
import { RifaController } from './rifas/rifa.controller';
import { RifaService } from './rifas/rifa.service';

@Module({
  imports: [],
  controllers: [AuthController, RifaController],
  providers: [AuthService, PrismaService, RifaService],
})
export class AppModule {}
