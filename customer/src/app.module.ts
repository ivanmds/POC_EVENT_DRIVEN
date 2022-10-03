import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { OpenTelemetryModule } from 'nestjs-otel';
import { KafkaBus } from './common/kafka/kafka-bus';
import { Mapper } from './common/mappers/mapper';
import { Tracing } from './common/otlp/tracing';
import { ProtobufConverter } from './common/protobufs/protobuf-converter';
import { CustomerCreateOrUpdateConsumer } from './consumers/customer-create-or-update.consumer';
import { CustomerSnapshotController } from './controllers/customer-snapshot.controller';
import { CustomerController } from './controllers/customer.controller';
import { CustomerEventStoreRepository } from './domain/repositories/customer-event-store.repository';
import { CustomerShapshotRepository } from './domain/repositories/customer-snapshot.repository';
import { CustomerService } from './domain/services/customer.service';

const customerCreateUpdateConsumer = {
  provide: "CUSTOMER_CREATE_UPDATE_CONSUMER",
  inject: [
    CustomerService,
    CustomerShapshotRepository,
    Mapper
  ],
  useFactory: async (
    customerService: CustomerService,
    customerSnapshotRepository: CustomerShapshotRepository,
    mapper: Mapper
  ) => {
    return new CustomerCreateOrUpdateConsumer(customerService, customerSnapshotRepository, mapper);
  }
};


const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot({
  metrics: {
    hostMetrics: true, // Includes Host Metrics
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
    PrometheusModule.register(),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    OpenTelemetryModuleConfig
  ],
  providers: [
    Tracing,
    KafkaBus, 
    Mapper, 
    CustomerService, 
    CustomerEventStoreRepository, 
    ProtobufConverter, 
    CustomerShapshotRepository,
    customerCreateUpdateConsumer],

  controllers: [CustomerController, CustomerSnapshotController]
})
export class AppModule { }
