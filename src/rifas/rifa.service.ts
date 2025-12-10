import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateRifaDto } from './dto/create-rifa.dto';
import { isValidCPF } from '../utils/validators';
import { RifaStatus } from '@prisma/client';

@Injectable()
export class RifaService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma nova rifa aplicando a regra:
   * - cada CPF pode ter no máximo 2 rifas ativas (PUBLISHED ou PAUSED)
   */
  async createRifa(dto: CreateRifaDto) {
    const {
      criadorId,
      titulo,
      descricao,
      quantidade_total,
      valor_por_numero,
      percentual_minimo,
      data_sorteio_prev,
      tipo_premio,
      limite_por_part,
      termos,
    } = dto;

    // Buscar criador
    const criador = await this.prisma.user.findUnique({ where: { id: criadorId } });
    if (!criador) {
      throw new BadRequestException('Criador não encontrado.');
    }

    // Exigir CPF preenchido no cadastro do criador
    if (!criador.cpf) {
      throw new BadRequestException('CPF do criador não cadastrado. Complete o cadastro do criador antes de criar rifas.');
    }

    // Validar CPF do criador
    if (!isValidCPF(criador.cpf)) {
      throw new BadRequestException('CPF do criador inválido. Corrija o CPF no cadastro antes de criar rifas.');
    }

    // Contar rifas ativas (PUBLISHED ou PAUSED) relacionadas ao criador (por criadorId)
    const activeCount = await this.prisma.rifa.count({
      where: {
        criadorId: criador.id,
        status: { in: [RifaStatus.PUBLISHED, RifaStatus.PAUSED] },
      },
    });

    if (activeCount >= 2) {
      throw new BadRequestException('Limite de rifas ativas atingido: você já possui 2 rifas ativas. Finalize ou cancele uma para criar outra.');
    }

    // Preencher percentual mínimo default (40%) se não informado
    const percentual = percentual_minimo ?? 40;
    const valor_total_possivel = quantidade_total * valor_por_numero;
    const valor_minimo = (valor_total_possivel * percentual) / 100;

    // Criar rifa em DRAFT (a publicação é operação separada)
    const rifa = await this.prisma.rifa.create({
      data: {
        criadorId: criador.id,
        titulo,
        descricao,
        quantidade_total,
        valor_por_numero: Number(valor_por_numero),
        percentual_minimo: Number(percentual),
        valor_minimo: Number(valor_minimo),
        data_sorteio_prev: new Date(data_sorteio_prev),
        tipo_premio: tipo_premio as any,
        limite_por_part,
        termos,
        status: 'DRAFT',
      },
    });

    return rifa;
  }
}
