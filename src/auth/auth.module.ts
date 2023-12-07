import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as strategies from './strategies/strategies';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    strategies.AccessTokenService,
    strategies.RefreshTokenService,
  ],
})
export class AuthModule {}
