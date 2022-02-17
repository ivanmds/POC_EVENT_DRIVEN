import { Module } from '@nestjs/common';
import { PixPaymentController } from './controllers/pix-payment.controller';
import { PixPaymentRepository } from './domain/repositories/pix-payment.repository';
import { PixPaymentService } from './domain/services/pix-payment.service';

@Module({
  imports: [],
  controllers: [PixPaymentController],
  providers: [PixPaymentRepository, PixPaymentService],
})
export class AppModule {}
