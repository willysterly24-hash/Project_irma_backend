import { Module } from '@nestjs/common';
import { DeviseController } from './devise.controller';

@Module({
  controllers: [DeviseController],
})
export class DeviseModule {}
