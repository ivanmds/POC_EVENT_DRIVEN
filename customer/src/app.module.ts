import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { environment } from './common/environment';
import { KafkaBus } from './common/kafka/kafka-bus';
import { KafkaConnection } from './common/kafka/kafka.connection';
import { Mapper } from './common/mappers/mapper';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: environment.fileName() }),
  ],
  providers: [KafkaConnection, KafkaBus, Mapper]
})
export class AppModule { }
