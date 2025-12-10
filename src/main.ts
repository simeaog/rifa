import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { startReservationExpirer } from './jobs/reservation-expirer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.APP_PORT || 3000;
  await app.listen(port);
  console.log(`Rifa backend listening on http://localhost:${port}`);

  // start background job to expire reservations (for testing/dev)
  startReservationExpirer();
}
bootstrap();
