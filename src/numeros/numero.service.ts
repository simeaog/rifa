import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { ReserveNumbersDto } from './dto/reserve-numbers.dto';
import { ConfirmNumbersDto } from './dto/confirm-numbers.dto';
import { RifaStatus, NumeroStatus, ReservaStatus } from '@prisma/client';

@Injectable()
export class NumeroService {
  constructor(private readonly prisma: PrismaService) {}

  async listNumbers(rifaId: string) {
    const numeros = await this.prisma.numero.findMany({ where: { rifaId }, orderBy: { numero: 'asc' } });
    return numeros;
  }

  async reserveNumbers(rifaId: string, dto: ReserveNumbersDto) {
    const { userId, numeros, reserveMinutes } = dto;
    if (!numeros || numeros.length === 0) throw new BadRequestException('Nenhum número fornecido');

    const rifa = await this.prisma.rifa.findUnique({ where: { id: rifaId } });
    if (!rifa) throw new BadRequestException('Rifa não encontrada');
    if (rifa.status !== RifaStatus.PUBLISHED) throw new BadRequestException('Rifa não está publicada');

    const now = new Date();
    const reservedUntil = new Date(now.getTime() + (reserveMinutes ?? 30) * 60_000);

    const result = await this.prisma.$transaction(async (tx) => {
      const availableCount = await tx.numero.count({ where: { rifaId, numero: { in: numeros }, status: NumeroStatus.AVAILABLE } });
      if (availableCount !== numeros.length) throw new BadRequestException('Alguns números não estão disponíveis');

      await tx.numero.updateMany({
        where: { rifaId, numero: { in: numeros }, status: NumeroStatus.AVAILABLE },
        data: { status: NumeroStatus.RESERVED, reservedBy: userId, reservedUntil },
      });

      const priced = await tx.numero.findMany({ where: { rifaId, numero: { in: numeros } } });
      const total = priced.reduce((s, p) => s + (p.price ?? rifa.valor_por_numero), 0);

      const reserva = await tx.reserva.create({ data: { rifaId, userId, numeros: JSON.stringify(numeros), total, status: ReservaStatus.PENDING } });
      return reserva;
    });

    return result;
  }

  async confirmReservation(rifaId: string, dto: ConfirmNumbersDto) {
    const { reservaId, confirmerId } = dto;

    const reserva = await this.prisma.reserva.findUnique({ where: { id: reservaId } });
    if (!reserva || reserva.rifaId !== rifaId) throw new BadRequestException('Reserva não encontrada para esta rifa');
    if (reserva.status !== ReservaStatus.PENDING) throw new BadRequestException('Reserva não está pendente');

    const rifa = await this.prisma.rifa.findUnique({ where: { id: rifaId } });
    if (!rifa) throw new BadRequestException('Rifa não encontrada');

    const confirmer = await this.prisma.user.findUnique({ where: { id: confirmerId } });
    if (!confirmer) throw new BadRequestException('Usuário confirmador não encontrado');
    if (!(confirmer.role === 'ADMIN' || rifa.criadorId === confirmerId)) throw new ForbiddenException('Apenas o criador ou admin podem confirmar pagamento');

    const numeros: number[] = JSON.parse(reserva.numeros);

    await this.prisma.$transaction(async (tx) => {
      const reservedCount = await tx.numero.count({ where: { rifaId, numero: { in: numeros }, status: NumeroStatus.RESERVED, reservedBy: reserva.userId } });
      if (reservedCount !== numeros.length) throw new BadRequestException('Alguns números não estão reservados pelo comprador');

      await tx.numero.updateMany({ where: { rifaId, numero: { in: numeros } }, data: { status: NumeroStatus.SOLD, soldTo: reserva.userId, soldAt: new Date() } });

      await tx.reserva.update({ where: { id: reservaId }, data: { status: ReservaStatus.CONFIRMED } });
    });

    return { success: true };
  }
}
