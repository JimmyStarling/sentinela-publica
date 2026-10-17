
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
      }).prefs({
        abortEarly: false,
      }),
    }),

    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY!,
      appSecret: process.env.OBSERVE_APP_SECRET!,
      serviceId: 'sentinela-api',
    }),

    
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        url: config.getOrThrow<string>('DATABASE_URL'),

        ssl: {
          rejectUnauthorized: true,
        },

        autoLoadEntities: true,
        synchronize: false,
        migrationsRun: false,
      }),
    }),


    OrgaosModule,
    ServicosModule,
  ],

  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
