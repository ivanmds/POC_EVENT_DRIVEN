import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { environment } from './common/environment';
import { KafkaBus } from './common/kafka/kafka-bus';
import { KafkaConnection } from './common/kafka/kafka.connection';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: environment.fileName() }),
  ],
  providers: [KafkaConnection, KafkaBus]
})
export class AppModule { }
