import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {}

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const baseUrl = this.configService.get('app.webBaseUrl');
    const verificationLink = `${baseUrl}/verify-email?token=${token}`;

    // In a real application, this would send an actual email
    // For now, we'll just log the email details
    console.log('=== Verification Email ===');
    console.log(`To: ${email}`);
    console.log('Subject: Verify your email address');
    console.log('Body:');
    console.log(
      `Please click the following link to verify your email address:`,
    );
    console.log(verificationLink);
    console.log('========================');
  }
}
