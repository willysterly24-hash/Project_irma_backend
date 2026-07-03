import { Module } from '@nestjs/common';
import { PaysController } from './pays.controller';

@Module({
  controllers: [PaysController],
})
export class PaysModule {}
