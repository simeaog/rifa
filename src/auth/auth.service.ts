import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaService();
  }

  async enter(whatsapp: string, nome?: string) {
    // Normalizar: aceitar apenas números e converter para E.164 com +55 por default se necessário
    const normalized = whatsapp.replace(/\D/g, '');
    // Busca usuário por whatsapp
    let user = await this.prisma.user.findUnique({ where: { whatsapp: normalized } }).catch(()=>null);
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          whatsapp: normalized,
          nome: nome || '—',
        },
      });
    } else if (nome && user.nome !== nome) {
      // Atualiza nome se fornecido e diferente
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { nome },
      });
    }
    // Retornar sessão simples (a ser trocado por JWT/Session)
    return { userId: user.id, nome: user.nome, whatsapp: user.whatsapp };
  }
}
