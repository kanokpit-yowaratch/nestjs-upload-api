import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // add multiple origins here
    origin: [
      "http://localhost:3000/",
      "http://localhost:3333/",
      "https://nextjs-upload-file-gules.vercel.app/",
    ],

    // Allow all origin
    // origin: '*',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      forbidNonWhitelisted: true,
      // whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Upload example')
    .setDescription('The Upload API description')
    .setVersion('1.0')
    .addServer('http://localhost:4444/', 'Local environment')
    .addServer('https://seer-of-human.com/', 'Production')
    .addTag('Upload')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  await app.listen(process.env.API_PORT);
}
bootstrap();
