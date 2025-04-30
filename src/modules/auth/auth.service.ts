import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<ApiResponse> {
    const { email, password, fullName } = signupDto;

    // Check if user exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate email verification token
    const emailVerificationToken = this.jwtService.sign(
      { email },
      { expiresIn: '24h' },
    );

    // Create user
    const user = this.userRepository.create({
      email,
      fullName,
      password: hashedPassword,
      emailVerificationToken,
      emailVerificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    await this.userRepository.save(user);

    // TODO: Send verification email with token
    return {
      response_code: 'AUTH001',
      response_desc: 'User registered successfully. Please verify your email.',
      success: true,
      data: {
        email: user.email,
        fullName: user.fullName,
        verificationToken: emailVerificationToken, // Remove in production
      },
    };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<ApiResponse> {
    const { token } = verifyEmailDto;

    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: {
          email: payload.email,
          emailVerificationToken: token,
          isEmailVerified: false,
          active_status: true,
          del_status: false,
        },
      });

      if (!user) {
        throw new BadRequestException('Invalid verification token');
      }

      if (user.emailVerificationTokenExpiry < new Date()) {
        throw new BadRequestException('Verification token has expired');
      }

      user.isEmailVerified = true;
      user.emailVerificationToken = null;
      user.emailVerificationTokenExpiry = null;

      await this.userRepository.save(user);

      return {
        response_code: 'AUTH006',
        response_desc: 'Email verified successfully',
        success: true,
        data: null,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Invalid or expired verification token');
    }
  }

  async resendVerificationEmail(email: string): Promise<ApiResponse> {
    const user = await this.userRepository.findOne({
      where: {
        email,
        isEmailVerified: false,
        active_status: true,
        del_status: false,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found or already verified');
    }

    // Generate new verification token
    const emailVerificationToken = this.jwtService.sign(
      { email },
      { expiresIn: '24h' },
    );

    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationTokenExpiry = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    );

    await this.userRepository.save(user);

    // TODO: Send verification email with token

    return {
      response_code: 'AUTH007',
      response_desc: 'Verification email resent successfully',
      success: true,
      data: {
        verificationToken: emailVerificationToken, // Remove in production
      },
    };
  }

  async login(loginDto: LoginDto): Promise<ApiResponse> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userRepository.findOne({
      where: {
        email,
        active_status: true,
        del_status: false,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const token = this.jwtService.sign({ sub: user.id });

    return {
      response_code: 'AUTH002',
      response_desc: 'Login successful',
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
      },
    };
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ApiResponse> {
    const { email } = forgotPasswordDto;

    const user = await this.userRepository.findOne({
      where: {
        email,
        active_status: true,
        del_status: false,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Generate reset token
    const resetToken = this.jwtService.sign(
      { sub: user.id, type: 'reset' },
      { expiresIn: '1h' },
    );

    // TODO: Send email with reset token
    // For now, we'll just return the token in the response
    return {
      response_code: 'AUTH003',
      response_desc: 'Password reset instructions sent',
      success: true,
      data: { resetToken }, // In production, don't send token in response
    };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<ApiResponse> {
    const { token, newPassword } = resetPasswordDto;

    try {
      const payload = this.jwtService.verify(token);
      if (payload.type !== 'reset') {
        throw new BadRequestException('Invalid reset token');
      }

      const user = await this.userRepository.findOne({
        where: {
          id: payload.sub,
          active_status: true,
          del_status: false,
        },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      await this.userRepository.save(user);

      return {
        response_code: 'AUTH004',
        response_desc: 'Password reset successful',
        success: true,
        data: null,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  async getProfile(userId: string): Promise<ApiResponse> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        active_status: true,
        del_status: false,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      response_code: 'AUTH005',
      response_desc: 'User profile retrieved successfully',
      success: true,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }
}
