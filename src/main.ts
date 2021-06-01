import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  const options = new DocumentBuilder()
    .setTitle('Book Store')
    .setDescription('The Book Store API description')
    .setVersion('1.0')
    .addTag('books')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/v1', app, document);

  await app.listen(AppModule.port);
}
bootstrap();
