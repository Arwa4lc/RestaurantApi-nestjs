import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtGuard } from './common/guards/jwt.guard';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      validateCustomDecorators: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
  });
  // app.useGlobalFilters();
  // app.useGlobalGuards(new JwtGuard());

  const options = new DocumentBuilder()
    .setTitle('Restaurants')
    .setDescription('Restaurants Management application')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      name: 'authorization',
      scheme: 'bearer',
      in: 'header',
      bearerFormat: 'Bearer',
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
