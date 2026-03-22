import { Resend } from "resend";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export class EmailService {
  private resend: Resend | null = null;
  private defaultFromEmail: string;
  private testEmail: string | undefined;

  constructor(defaultFrom?: string) {
    this.defaultFromEmail = defaultFrom || "HealPro <onboarding@resend.dev>";
  }

  initialize(apiKey: string, testEmail?: string) {
    if (!this.resend) {
      this.resend = new Resend(apiKey);
      this.testEmail = testEmail;
      if (testEmail) {
        console.log(
          `✅ [EMAIL] Test email configured: All emails will be sent to ${testEmail}`
        );
      }
    }
  }

  async sendEmail(options: EmailOptions) {
    if (!this.resend) {
      console.warn("⚠️ [EMAIL] Resend API key not initialized. Using mock.");
      return this.mockSendEmail(options);
    }

    try {
      let { to, subject, html, from = this.defaultFromEmail } = options;

      // If test email is configured, override the recipient
      if (this.testEmail) {
        console.log(
          `⚠️ [EMAIL] Development Mode: Redirecting email for ${to} to ${this.testEmail}`
        );
        html =
          `<div style="background: #fff3cd; padding: 10px; border: 1px solid #ffeeba; margin-bottom: 20px;">
          <strong>Development Mode</strong><br/>
          Original Recipient: ${to}
        </div>` + html;
        to = this.testEmail;
      }

      console.log("📧 [EMAIL] Sending email via Resend:", {
        to,
        subject,
      });

      const data = await this.resend.emails.send({
        from,
        to,
        subject,
        html,
      });

      console.log("✅ [EMAIL] Email sent successfully:", data);
      return { data, error: null };
    } catch (error) {
      console.error("❌ [EMAIL] Failed to send email:", error);
      throw error;
    }
  }

  private async mockSendEmail(options: EmailOptions) {
    const { to, subject, html, from = this.defaultFromEmail } = options;
    console.log("📧 [MOCK] Sending email:", {
      from,
      to,
      subject,
      htmlLength: html.length,
    });

    console.log("✅ [MOCK] Email sent successfully");
    return { data: { id: "mock-email-id" }, error: null };
  }
}

// Export singleton instance
export const emailService = new EmailService();
