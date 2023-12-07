import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import * as dto from './dto/dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signup(user: dto.User): Promise<any> {
    user.password = await argon2.hash(user.password);
    const tokens = await this.provideTokens(user.id, user.email);
    const rtHash = await this.hashRefreshToken(tokens.refreshToken);

    await this.prisma.user.create({
      data: {
        email: user.email,
        hash: user.password,
        rt_hash: rtHash,
        name: user.name,
      },
    });
    return tokens;
  }

  async signin(user: dto.UserLoginDTO) {
    const _user = await this.findUniqueEmail(user.email);
    //validate password and hash with {verify} method
    const hashValidator = await argon2.verify(_user.hash, user.password);
    if (!hashValidator) throw new UnauthorizedException();
    const tokens = await this.provideTokens(_user.id, user.email);
    const rtHash = await argon2.hash(tokens.refreshToken);
    await this.refreshTokenUpdate(_user.id, rtHash);
    return tokens;
  }

  async findUniqueEmail(value: string): Promise<dto.User> {
    return await this.prisma.user.findUnique({
      where: { email: value },
    });
  }
  //return a object with the access-token and the refresh-token
  async provideTokens(id: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(
        {
          sub: id,
          email: email,
        },
        {
          expiresIn: 60,
        },
      ),
      this.jwtService.sign(
        {
          sub: id,
          email: email,
        },
        {
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
  //updated the refresh token in the database
  async refreshTokenUpdate(id, rt_hash: string) {
    await this.prisma.user.update({
      where: { id },
      data: {
        rt_hash: rt_hash,
      },
    });
  }
  //hash the refresh token
  async hashRefreshToken(refreshToken: string) {
    return await argon2.hash(refreshToken);
  }
  async validateRefreshToken(id: number, rt: string) {
    const token = await this.prisma.user.findFirst({
      where: { id },
      select: { rt_hash: true },
    });
    const validate = await argon2.verify(token.rt_hash, rt);
    if (!validate) return false;

    return true;
  }
  async getRefreshToken(user, rt: string) {
    rt = rt.split(' ')[1];
    const validation = await this.validateRefreshToken(user.sub, rt);
    if (!validation) throw new ForbiddenException('Refresh token invalid');
    const tokens = await this.provideTokens(user.sub, user.email);
    const rtHash = await this.hashRefreshToken(tokens.refreshToken);
    await this.refreshTokenUpdate(user.sub, rtHash);
    return tokens;
  }
}
