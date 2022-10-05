import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('Customer Api')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  
  await app.listen(3001);

  var customerCreateUpdateConsumer = app.get("CUSTOMER_CREATE_UPDATE_CONSUMER");
  if (!customerCreateUpdateConsumer) {
      throw Error('paymentConsentConsumer not found');
  }
  customerCreateUpdateConsumer.init();
}
bootstrap();
