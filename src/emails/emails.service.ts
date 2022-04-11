import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { sign } from 'jsonwebtoken';

@Injectable()
export class EmailsService {
  constructor(private readonly emailService: EmailsService) {}

  generateEmailConfirmationToken(userId: string): string {
    const now = new Date().getTime();
    const exp = Math.floor(
      new Date(now).setSeconds(
        parseInt(
          process.env.JWT_EMAIL_CONFIRMATION_EXPIRATION_TIME as string,
          10,
        ),
      ) / 1000,
    );
    const iat = Math.floor(now / 1000);

    return sign(
      {
        sub: userId,
        iat,
        exp,
      },
      process.env.JWT_EMAIL_CONFIRMATION_SECRET_KEY as string,
    );
  }

  async sendEmail(tokenSign: string, email: string) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
    const msg = {
      to: email,
      from: process.env.SENDGRID_SENDER_EMAIL as string,
      subject: 'Change Password',
      text: `Here: http://localhost:3000/auth/change-password?token=${tokenSign}`,
      html: `<strong>Token: ${tokenSign}</strong>`,
    };
    await sgMail.send(msg);
  }
}
