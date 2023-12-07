import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
@Injectable()
export class AccessTokenService extends PassportStrategy(
  Strategy,
  'jwt-access-token',
) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const rt = req.headers['authorization'].split(' ')[1];
    const user = await this.getCurrentUser(payload.sub);
    const validate = await argon2.verify(user.rt_hash, rt);
    if (validate) {
      throw new ForbiddenException('no puedes usar el rt para esta accion');
    }
    return payload;
  }

  async getCurrentUser(id) {
    return await this.prisma.user.findFirst({
      where: {
        id: id,
      },
      select: {
        rt_hash: true,
      },
    });
  }
}
