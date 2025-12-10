import { IsString, IsNotEmpty, IsNumber, Min, IsOptional, IsEnum, IsInt, IsPositive, IsDateString } from 'class-validator';

export enum PremioTipoDTO {
  FISICO = 'FISICO',
  DINHEIRO = 'DINHEIRO',
  SIMBOLICO = 'SIMBOLICO',
}

export class CreateRifaDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsInt()
  @Min(2)
  quantidade_total: number;

  @IsNumber()
  @IsPositive()
  valor_por_numero: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  percentual_minimo?: number; // percentual (ex: 40). Default preenchido no service.

  @IsDateString()
  data_sorteio_prev: string;

  @IsEnum(PremioTipoDTO)
  tipo_premio: PremioTipoDTO;

  @IsInt()
  @Min(0)
  @IsOptional()
  limite_por_part?: number;

  @IsString()
  @IsOptional()
  termos?: string;

  @IsString()
  @IsNotEmpty()
  criadorId: string; // uuid do usuário criador
}
