import { Module } from '@nestjs/common';
import { config } from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import * as guard from './auth/common/guards/guard';
import { PrismaModule } from './prisma/prisma.module';
config();
@Module({
  imports: [AuthModule, UserModule, PrismaModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: guard.AccessTokenGuard,
    },
  ],
})
export class AppModule {}
