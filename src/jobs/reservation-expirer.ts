import { PrismaService } from '../prisma.service';
import { NumeroStatus, ReservaStatus } from '@prisma/client';

const prisma = new PrismaService();

export function startReservationExpirer(intervalMs = 60_000) {
  async function expireOnce() {
    try {
      const now = new Date();
      // liberar numeros cujo reservedUntil já passou
      await prisma.$transaction(async (tx) => {
        const expiredNumeros = await tx.numero.findMany({ where: { status: NumeroStatus.RESERVED, reservedUntil: { lt: now } } });
        for (const n of expiredNumeros) {
          await tx.numero.update({ where: { id: n.id }, data: { status: NumeroStatus.AVAILABLE, reservedBy: null, reservedUntil: null } });
        }

        // cancelar reservas pendentes antigas (criado há mais de 35 minutos)
        const cutoff = new Date(now.getTime() - 35 * 60_000);
        const oldRes = await tx.reserva.findMany({ where: { status: ReservaStatus.PENDING, createdAt: { lt: cutoff } } });
        for (const r of oldRes) {
          await tx.reserva.update({ where: { id: r.id }, data: { status: ReservaStatus.CANCELLED } });
        }
      });
    } catch (err) {
      console.error('Error expiring reservations:', err);
    }
  }

  // run immediately and then on interval
  expireOnce();
  const handle = setInterval(expireOnce, intervalMs);
  return () => clearInterval(handle);
}
