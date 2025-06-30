import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:4200', 
    credentials: true,              
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,   
      transform: true,   
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Pokedex API')
    .setDescription('API pour les Pokémon')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
