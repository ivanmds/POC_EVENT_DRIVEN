import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { environment } from './common/environment';
import { KafkaBus } from './common/kafka/kafka-bus';
import { KafkaConnection } from './common/kafka/kafka.connection';
import { Mapper } from './common/mappers/mapper';
import { CustomerController } from './controllers/customer.controller';
import { CustomerService } from './domain/services/customer.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: environment.fileName() }),
  ],
  providers: [KafkaConnection, KafkaBus, Mapper, CustomerService],
  controllers: [CustomerController]
})
export class AppModule { }
