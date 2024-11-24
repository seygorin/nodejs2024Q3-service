import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh.dto';
import { LoggingService } from '../logging/logging.service';

interface TokenPayload {
  userId: string;
  login: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private loggingService: LoggingService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    this.loggingService.debug('Attempting to create new user', {
      login: signUpDto.login,
    });
    if (!signUpDto.login || !signUpDto.password) {
      throw new BadRequestException('Login and password are required');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { login: signUpDto.login },
    });

    if (existingUser) {
      throw new BadRequestException('User with this login already exists');
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        login: signUpDto.login,
        password: hashedPassword,
      },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    this.loggingService.log('User successfully created', { userId: user.id });
    return user;
  }

  async login(loginDto: LoginDto) {
    if (!loginDto.login || !loginDto.password) {
      throw new BadRequestException('Login and password are required');
    }

    const user = await this.prisma.user.findUnique({
      where: { login: loginDto.login },
    });

    if (!user) {
      throw new ForbiddenException('Invalid login credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid login credentials');
    }

    const tokens = await this.generateTokens(user.id, user.login);
    return tokens;
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    if (!refreshTokenDto.refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      const decoded = await this.jwtService.verifyAsync<TokenPayload>(
        refreshTokenDto.refreshToken,
        {
          secret: process.env.JWT_SECRET_REFRESH_KEY,
        },
      );

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new ForbiddenException('User no longer exists');
      }

      const tokens = await this.generateTokens(decoded.userId, decoded.login);
      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new ForbiddenException('Invalid refresh token');
    }
  }

  async generateTokens(userId: string, login: string) {
    const payload: TokenPayload = { userId, login };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_REFRESH_KEY,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
