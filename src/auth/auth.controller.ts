import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import * as dto from './dto/dto';
import { AuthService } from './auth.service';
import { isPublic } from './common/decorators/public.metadata';
import * as guards from './common/guards/guard';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @isPublic()
  @Post('/login')
  async logIn(@Body() user: dto.UserLoginDTO) {
    return await this.authService.signin(user);
  }
  @isPublic()
  @Post('/user')
  async signup(@Body() user: dto.User) {
    try {
      return await this.authService.signup(user);
    } catch (error) {
      throw new ForbiddenException('Request Error');
    }
  }
  @isPublic()
  @Get('/refresh-token')
  @UseGuards(guards.RefreshTokenGuard)
  async refreshToken(@Req() req) {
    return this.authService.getRefreshToken(
      req.user,
      req.headers['authorization'],
    );
  }
}
