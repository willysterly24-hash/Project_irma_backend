import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { GlobalExceptionFilter } from './auth/http-exception.filter';
import { RolesGuard } from './auth/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });

  // Filtre global d'erreurs HTTP — retourne toujours un JSON structuré
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Validation globale des DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    errorHttpStatusCode: 400,
  }));

  // RBAC global — le RolesGuard s'applique partout
  
  // Active @Exclude() et @Expose() sur toutes les réponses
app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const config = new DocumentBuilder()
    .setTitle('IRMA Hotel API')
    .setDescription('API de gestion hôtelière IRMA — NestJS, TypeORM, JWT, RBAC')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 IRMA Backend running on http://localhost:3000');
  console.log('📖 Swagger docs: http://localhost:3000/api');
}
bootstrap();
