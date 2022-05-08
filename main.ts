import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from 'app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { configService } from 'core/config.service';
import basicAuth from 'express-basic-auth';
import { JwtGuard } from './src/modules/auth/guards/jwt.guard';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawBodyBuffer = (req: any, _: any, buf: any, encoding: any): void => {
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf8');
    }
  };

  app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }));
  app.use(bodyParser.json({ verify: rawBodyBuffer }));

  app.enableCors();

  const jwtAuthGuard = app.get(JwtGuard);
  app.useGlobalGuards(jwtAuthGuard);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // serialize all outputs

  app.use(
    '/api',
    basicAuth({
      challenge: true,
      users: {
        admin: '1]jUz.H~Tg+cE"6Y3',
      },
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Zartosht Test Kargo Api Endpoints')
    .setDescription('Test Project for showing cargo movement process')
    .setVersion('1')
    .addBearerAuth({ type: 'http', in: 'api', name: 'Authorization', bearerFormat: 'jwt' })
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    ...configService.getExtraModels(),
  });
  SwaggerModule.setup('/api', app, document);

  const { host, port } = configService.getHostAndPort();
  await app.listen(Number(port) || 3000, host, () => {
    console.log(`Nest application started on %s:%s`, host, port);
  });
}
bootstrap();
