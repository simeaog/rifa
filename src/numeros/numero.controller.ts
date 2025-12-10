import { Controller, Get, Post, Param, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { NumeroService } from './numero.service';
import { ReserveNumbersDto } from './dto/reserve-numbers.dto';
import { ConfirmNumbersDto } from './dto/confirm-numbers.dto';

@Controller('api/rifas/:rifaId/numeros')
export class NumeroController {
  constructor(private readonly numeroService: NumeroService) {}

  @Get()
  async list(@Param('rifaId') rifaId: string) {
    return this.numeroService.listNumbers(rifaId);
  }

  @Post('reserve')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async reserve(@Param('rifaId') rifaId: string, @Body() body: ReserveNumbersDto) {
    return this.numeroService.reserveNumbers(rifaId, body);
  }

  @Post('confirm')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async confirm(@Param('rifaId') rifaId: string, @Body() body: ConfirmNumbersDto) {
    return this.numeroService.confirmReservation(rifaId, body);
  }
}
