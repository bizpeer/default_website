export interface EmailSettings {
  provider: 'resend' | 'brevo' | 'sendgrid' | 'smtp';
  apiKey: string;
  fromEmail: string;
  fromName: string;
  enableBcc: boolean;
}

export const defaultEmailSettings: EmailSettings = {
  provider: 'resend',
  apiKey: '',
  fromEmail: 'onboarding@resend.dev',
  fromName: '조선미녀 고객지원팀',
  enableBcc: false,
};

export const getEmailSettings = (): EmailSettings => {
  const saved = localStorage.getItem('email_service_settings');
  if (saved) {
    try {
      return { ...defaultEmailSettings, ...JSON.parse(saved) };
    } catch (e) {
      return defaultEmailSettings;
    }
  }
  return defaultEmailSettings;
};

export interface SendEmailOptions {
  toEmail: string;
  customerName: string;
  subject: string;
  replyContent: string;
}

/**
 * Send inquiry reply transactional email using Resend API / Brevo / SendGrid or Simulated Fallback
 */
export async function sendInquiryReplyEmail({
  toEmail,
  customerName,
  subject,
  replyContent,
}: SendEmailOptions): Promise<{ success: boolean; message: string; provider: string }> {
  const settings = getEmailSettings();

  // 1. Resend API Dispatch
  if (settings.provider === 'resend' && settings.apiKey.trim().startsWith('re_')) {
    try {
      const htmlBody = `
        <div style="font-family: 'Apple SD Gothic Neo', sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; background-color: #ffffff;">
          <div style="text-align: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 24px;">
            <h2 style="font-family: serif; letter-spacing: 2px; color: #0f172a; margin: 0;">BEAUTY OF JOSEON</h2>
            <p style="font-size: 12px; color: #64748b; margin-top: 4px;">조선미녀 고객지원 답변 안내</p>
          </div>
          <div style="color: #334155; font-size: 14px; line-height: 1.6;">
            <p>안녕하세요, <strong>${customerName}</strong> 고객님.</p>
            <p>보내주신 1:1 문의사항에 대한 답변을 안내해 드립니다.</p>

            <div style="background-color: #f8fafc; border-left: 4px solid #0f172a; padding: 16px; margin: 20px 0; border-radius: 4px;">
              <p style="font-size: 12px; font-weight: bold; color: #475569; margin: 0 0 6px 0;">[문의 제목] ${subject}</p>
            </div>

            <div style="background-color: #ffffff; border: 1px solid #cbd5e1; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
              <p style="font-size: 13px; font-weight: bold; color: #0f172a; margin: 0 0 8px 0;">💬 조선미녀 담당자 답변</p>
              <div style="font-size: 13px; color: #1e293b; whitespace: pre-line;">${replyContent}</div>
            </div>

            <p style="font-size: 12px; color: #94a3b8;">추가 문의사항이 있으시면 언제든지 조선미녀 고객센터(/support)를 이용해 주시기 바랍니다.<br />감사합니다.</p>
          </div>
          <div style="border-top: 1px solid #f1f5f9; pt: 16px; margin-top: 24px; text-align: center; font-size: 11px; color: #94a3b8;">
            <p>© BEAUTY OF JOSEON. All rights reserved.</p>
          </div>
        </div>
      `;

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${settings.apiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${settings.fromName} <${settings.fromEmail}>`,
          to: [toEmail],
          subject: `[조선미녀] 문의 답변 안내: ${subject}`,
          html: htmlBody,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: `Resend API로 실시간 이메일 전송이 완료되었습니다. (Email ID: ${data.id})`,
          provider: 'Resend API',
        };
      } else {
        const errData = await response.json();
        return {
          success: false,
          message: `Resend API 오류 (${response.status}): ${errData.message || 'API Key 및 발신자 이메일을 확인하세요.'}`,
          provider: 'Resend API Error',
        };
      }
    } catch (err: any) {
      return {
        success: false,
        message: `네트워크 또는 CORS 오류: ${err.message}`,
        provider: 'Resend Network Failure',
      };
    }
  }

  // 2. Simulated Dispatch for Brevo / SendGrid / Demo Mode
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `[${settings.provider.toUpperCase()} 모의 전송 완료] 고객(${toEmail})에게 1:1 답변 메일이 시뮬레이션 발송되었습니다.`,
        provider: settings.provider.toUpperCase(),
      });
    }, 400);
  });
}
