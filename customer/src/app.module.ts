import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { environment } from './common/environment';
import { KafkaBus } from './common/kafka/kafka-bus';
import { Mapper } from './common/mappers/mapper';
import { CustomerController } from './controllers/customer.controller';
import { CustomerService } from './domain/services/customer.service';

@Module({
  imports: [
    PrometheusModule.register(),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: environment.fileName() }),
  ],
  providers: [KafkaBus, Mapper, CustomerService],
  controllers: [CustomerController]
})
export class AppModule { }
