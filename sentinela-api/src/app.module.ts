import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';
import { createObserveModule } from '@nestjs/observe';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { OrgaosModule } from './orgaos/orgaos.module';
import { ServicosModule } from './servicos/servicos.module';
import { PontuacaoModule } from './pontuacao/pontuacao.module';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';

export const { ObserveModule, ObserveInstrument } =
  createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,

      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'test', 'production')
          .default('development'),

        DATABASE_URL: Joi.string().required(),
        SUPABASE_URL: Joi.string().uri().required(),
        SUPABASE_PUBLISHABLE_KEY: Joi.string().required(),
        OBSERVE_APP_KEY: Joi.string().required(),
        OBSERVE_APP_SECRET: Joi.string().required(),
      }).prefs({
        abortEarly: false,
      }),
    }),

    ObserveModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        appKey: config.getOrThrow<string>('OBSERVE_APP_KEY'),
        appSecret: config.getOrThrow<string>('OBSERVE_APP_SECRET'),
        serviceId: 'sentinela-api',
      }),
    }),

    
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (c: ConfigService) => ({
        type: 'postgres',
        url: c.getOrThrow<string>('DATABASE_URL'),
        ssl: {ca: readFileSync(join(process.cwd(), 'certs', 'supabase-ca.crt')).toString(),rejectUnauthorized: true,},
        autoLoadEntities: true,
        synchronize: false,//alterado de true para false para evitar perda de dados em produção
        migrationsRun: false, // alterado de true para false para evitar perda de dados em produção
      }),
    }),

    AuthModule,
    OrgaosModule,
    ServicosModule,
    PontuacaoModule,
  ],

  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}