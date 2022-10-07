import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Body,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CurrentUser } from '../common/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { LoginUserDto } from "../users/dto/login-user.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Res({ passthrough: true }) res: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    const tokenData = await this.authService.signUp(createUserDto);
    // TODO secure: true in options for https
    res.cookie('refreshToken', tokenData.refreshToken, {
      maxAge: tokenData.rtExpire,
      path: '/api/auth',
      httpOnly: true,
    });
    return {
      token: tokenData.accessToken,
      expire: tokenData.atExpire / 1000,
    };
  }

  @Post('signin')
  async signin(
    @Res({ passthrough: true }) res: Response,
    @Body() userDto: LoginUserDto,
  ): Promise<{ token: string; expire: number }> {
    const tokenData = await this.authService.signin(userDto);
    res.cookie('refreshToken', tokenData.refreshToken, {
      maxAge: tokenData.rtExpire,
      // path: '/api/auth',
      httpOnly: true,
      // sameSite: "none",
      // secure: true,
    });
    return {
      token: tokenData.accessToken,
      expire: tokenData.atExpire / 1000,
    };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@CurrentUser() user: any, @Res({ passthrough: true }) res: Response) {
    const refreshedTokenData = await this.authService.refreshTokens(
      user.uid,
      user.refreshToken,
    );
    res.cookie('refreshToken', refreshedTokenData.refreshToken, {
      maxAge: refreshedTokenData.rtExpire,
      // path: '/api/auth',
      httpOnly: true,
      // sameSite: "none",
      // secure: true,
    });
    return {
      token: refreshedTokenData.accessToken,
      expire: refreshedTokenData.atExpire / 1000,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser() user: User,
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    req.logout(() => {
      this.authService.logout(user.uid);
      res.cookie('refreshToken', '', {
        expires: new Date(),
        // path: '/api/auth',
        domain: 'localhost',
      });
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
