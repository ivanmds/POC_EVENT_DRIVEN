import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { KafkaBus } from './common/kafka/kafka-bus';
import { Mapper } from './common/mappers/mapper';
import { ProtobufConverter } from './common/protobufs/protobuf-converter';
import { CustomerController } from './controllers/customer.controller';
import { CustomerEventStoreRepository } from './domain/repositories/customer-event-store.repository';
import { CustomerService } from './domain/services/customer.service';

@Module({
  imports: [
    PrometheusModule.register(),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
  ],
  providers: [KafkaBus, Mapper, CustomerService, CustomerEventStoreRepository, ProtobufConverter],
  controllers: [CustomerController]
})
export class AppModule { }
