import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { RifaService } from './rifa.service';
import { CreateRifaDto } from './dto/create-rifa.dto';

@Controller('api/rifas')
export class RifaController {
  constructor(private readonly rifaService: RifaService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(@Body() createRifaDto: CreateRifaDto) {
    const rifa = await this.rifaService.createRifa(createRifaDto);
    return rifa;
  }
}
