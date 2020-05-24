import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { defaultPort } from './config';

const port = process.env.PORT || defaultPort;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  const options = new DocumentBuilder()
    .setTitle('Caching service')
    .setDescription(
      'Provides an in-memory storage and manipulation functionality for key/value pairs',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(`The server is listening on port ${port}`);
}
bootstrap();
