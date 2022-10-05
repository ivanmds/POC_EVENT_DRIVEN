import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaBus } from './common/kafka/kafka-bus';
import { Tracing } from './common/otlp/trancing';
import { CustomerController } from './controllers/customer.controller';
import { PixPaymentController } from './controllers/pix-payment.controller';
import { PixPaymentFraudAnalyseConsumer } from './cunsumer/pix-payment-fraud-analyse.consumer';
import { PixPaymentRepository } from './domain/repositories/pix-payment.repository';
import { PixPaymentService } from './domain/services/pix-payment.service';
import { OpenTelemetryModule } from 'nestjs-otel';

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

const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot({
  metrics: {
    hostMetrics: false, // Includes Host Metrics
    apiMetrics: {
      enable: true, // Includes api metrics
      defaultAttributes: {
        // You can set default labels for api metrics
        custom: 'label',
      },
      ignoreRoutes: ['/favicon.ico'], // You can ignore specific routes (See https://docs.nestjs.com/middleware#excluding-routes for options)
      ignoreUndefinedRoutes: false, //Records metrics for all URLs, even undefined ones
    },
  },
});

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    OpenTelemetryModuleConfig
  ],
  controllers: [PixPaymentController, CustomerController],
  providers: [Tracing, KafkaBus, PixPaymentRepository, PixPaymentService, customerCreateUpdateConsumer],
})
export class AppModule {}
