import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // add multiple origins here
    // origin: [
    //   "http://localhost:3000/",
    //   "http://localhost:3333/",
    //   "https://nextjs-upload-file-gules.vercel.app/",
    // ],
    // Allow all origin
    origin: '*',
  });

  const config = new DocumentBuilder()
    .setTitle('Upload example')
    .setDescription('The Upload API description')
    .setVersion('1.0')
    .addTag('Upload')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  await app.listen(process.env.API_PORT);
}
bootstrap();
