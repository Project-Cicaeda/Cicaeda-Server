import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({ //To validate dtos
      whitelist: true,
      forbidNonWhitelisted: true, //Throw an error when fields that aren't allowed when present instead of just removing them
    })
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
