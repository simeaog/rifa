import { IsString, IsNotEmpty } from 'class-validator';

export class ConfirmNumbersDto {
  @IsString()
  @IsNotEmpty()
  reservaId: string;

  @IsString()
  @IsNotEmpty()
  confirmerId: string;
}
