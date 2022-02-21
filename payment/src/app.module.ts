import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaBus } from './common/kafka/kafka-bus';
import { PixPaymentController } from './controllers/pix-payment.controller';
import { PixPaymentFraudAnalyseConsumer } from './cunsumer/pix-payment-fraud-analyse.consumer';
import { PixPaymentRepository } from './domain/repositories/pix-payment.repository';
import { PixPaymentService } from './domain/services/pix-payment.service';

const customerCreateUpdateConsumer = {
  provide: "PIX_PAYMENT_CONSUMER",
  inject: [
    PixPaymentRepository
  ],
  useFactory: async (
    pixPaymentRepository: PixPaymentRepository
  ) => {
    return new PixPaymentFraudAnalyseConsumer(pixPaymentRepository);
  }
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
  ],
  controllers: [PixPaymentController],
  providers: [KafkaBus, PixPaymentRepository, PixPaymentService, customerCreateUpdateConsumer],
})
export class AppModule {}
