import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envConfig } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const logger = new Logger('Bootstrap');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: envConfig.PORT,
      },
    },
  );
  await app.listen();
  logger.log(`Server is running on port ${envConfig.PORT}`);
  // const app = await NestFactory.create(AppModule);
  // const logger = new Logger('Bootstrap');

  // app.setGlobalPrefix('api');
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //   whitelist: true,
  //   forbidNonWhitelisted: true,
  //   })
  // );

  // await app.listen(envConfig.PORT, () => {
  //   console.log(`Server is running on port ${envConfig.PORT}`);
  // });
}
bootstrap();
