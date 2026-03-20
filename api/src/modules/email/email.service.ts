import { Injectable } from '@nestjs/common';
import { renderInvitationEmail } from './templates/invitation-email.template';
import { renderPasswordResetEmail } from './templates/password-reset-email.template';

@Injectable()
export class EmailService {
  private readonly apiKey = process.env.RESEND_API_KEY;
  private readonly fromEmail = process.env.RESEND_FROM_EMAIL;

  private async sendEmail({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }) {
    if (!this.apiKey || !this.fromEmail) {
      throw new Error('Resend configuration is missing');
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: this.fromEmail,
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Resend request failed: ${response.status} ${errorText}`);
    }
  }

  async sendInvitationEmail({
    to,
    invitationUrl,
    expiresInDays,
  }: {
    to: string;
    invitationUrl: string;
    expiresInDays: number;
  }) {
    return this.sendEmail({
      to,
      subject: 'Your Lens Music invitation',
      html: renderInvitationEmail({ invitationUrl, expiresInDays }),
    });
  }

  async sendPasswordResetEmail({
    to,
    resetUrl,
    expiresInMinutes,
  }: {
    to: string;
    resetUrl: string;
    expiresInMinutes: number;
  }) {
    return this.sendEmail({
      to,
      subject: 'Reset your Lens Music password',
      html: renderPasswordResetEmail({ resetUrl, expiresInMinutes }),
    });
  }
}
