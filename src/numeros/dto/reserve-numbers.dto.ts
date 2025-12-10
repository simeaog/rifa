import { IsString, IsNotEmpty, IsArray, ArrayMinSize, IsInt, Min, IsOptional } from 'class-validator';

export class ReserveNumbersDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @ArrayMinSize(1)
  numeros: number[];

  @IsInt()
  @Min(1)
  @IsOptional()
  reserveMinutes?: number;
}
