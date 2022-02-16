import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { KafkaBus } from './common/kafka/kafka-bus';
import { Mapper } from './common/mappers/mapper';
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

@Module({
  imports: [
    PrometheusModule.register(),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
  ],
  providers: [
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
