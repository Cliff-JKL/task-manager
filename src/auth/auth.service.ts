import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refreshToken.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async generateTokens(user: any) {
    const payload = {
      uid: user.uid,
      email: user.email,
      nickname: user.nickname,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.accessSecret,
        expiresIn: '30m',
      }),
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.refreshSecret,
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      atExpire: 30 * 60 * 1000,
      rtExpire: 7 * 24 * 60 * 60 * 1000,
    };
  }

  async updateRefreshToken(userUid: string, refreshToken: string) {
    const token = await this.refreshTokenRepository.findOne({
      where: {
        userUid: userUid,
      },
    });

    if (!token) {
      const createdToken = new RefreshToken();
      createdToken.userUid = userUid;
      createdToken.value = this.usersService.hashData(refreshToken);
      await this.refreshTokenRepository.save(createdToken);
    } else {
      await this.refreshTokenRepository.save({
        ...token,
        ...{ token: this.usersService.hashData(refreshToken) },
      });
    }
  }

  async signUp(userData: CreateUserDto) {
    const user = await this.usersService.create(userData);
    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.uid, tokens.refreshToken);
    return tokens;
  }

  async signin(userDto: CreateUserDto) {
    const user = await this.usersService.findOneByEmail(userDto.email);
    if (user && bcrypt.compareSync(userDto.password, user.password)) {
      const tokens = await this.generateTokens(user);
      await this.updateRefreshToken(user.uid, tokens.refreshToken);
      return tokens;
    }

    throw new NotFoundException();
  }

  async refreshTokens(userUid: string, refreshToken: string) {
    const user = await this.usersService.findOneByUid(userUid, [
      'refreshTokens',
    ]);
    if (!user || user.refreshTokens.length === 0) {
      throw new ForbiddenException('Access Denied');
    }

    const rtMatches = bcrypt.compareSync(
      refreshToken,
      user.refreshTokens[0].value,
    );
    if (!rtMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.uid, tokens.refreshToken);

    return tokens;
  }

  async logout(userUid: string) {
    const token = await this.refreshTokenRepository.findOne({
      where: {
        userUid: userUid,
      },
    });
    // TODO for many tokens: update refreshToken in DB (if its not null) to null
    if (!token) {
      return new ForbiddenException('Access Denied');
    }
    if (token.value !== null) {
      await this.refreshTokenRepository.delete(token);
    }
  }
}
