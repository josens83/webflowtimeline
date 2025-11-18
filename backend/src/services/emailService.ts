import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  // For development, use ethereal.email or configure your SMTP
  // For production, use your email service (Gmail, SendGrid, etc.)

  if (process.env.NODE_ENV === 'production') {
    // Production email configuration
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Development: Log emails to console instead of sending
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.SMTP_USER || 'test@ethereal.email',
        pass: process.env.SMTP_PASS || 'test',
      },
    });
  }
};

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Send email function
export const sendEmail = async ({ to, subject, html, text }: EmailOptions) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Web Trends Timeline'}" <${process.env.EMAIL_FROM || 'noreply@webtrends.com'}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    };

    const info = await transporter.sendMail(mailOptions);

    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Email sent (dev mode):', {
        to,
        subject,
        messageId: info.messageId,
        previewURL: nodemailer.getTestMessageUrl(info),
      });
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
};

// Welcome email template
export const sendWelcomeEmail = async (email: string, name: string) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to Web Trends Timeline!</h1>
        </div>
        <div class="content">
          <h2>안녕하세요, ${name}님!</h2>
          <p>Web Trends Timeline에 가입해 주셔서 감사합니다.</p>
          <p>이제 30년간의 웹 디자인 트렌드 변화를 한눈에 확인하실 수 있습니다.</p>

          <h3>지금 바로 시작하세요:</h3>
          <ul>
            <li>📊 국가별 웹 트렌드 비교</li>
            <li>🎨 시대별 디자인 변화 탐색</li>
            <li>📈 인사이트 분석 도구 활용</li>
          </ul>

          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/timeline" class="button">
            타임라인 탐색하기
          </a>

          <p>프리미엄 플랜으로 업그레이드하시면 더 많은 기능을 이용하실 수 있습니다:</p>
          <ul>
            <li>✨ 모든 국가 데이터 접근</li>
            <li>📊 상세 비교 분석</li>
            <li>📥 PDF/Excel 내보내기</li>
            <li>🚀 API 액세스</li>
          </ul>

          <div class="footer">
            <p>문의사항이 있으시면 언제든지 연락주세요.</p>
            <p>&copy; 2024 Web Trends Timeline. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Web Trends Timeline에 오신 것을 환영합니다! 🎉',
    html,
  });
};

// Contact confirmation email
export const sendContactConfirmationEmail = async (email: string, name: string, subject: string) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📬 문의가 접수되었습니다</h1>
        </div>
        <div class="content">
          <p>안녕하세요, ${name}님!</p>
          <p>문의해 주셔서 감사합니다. 귀하의 문의가 성공적으로 접수되었습니다.</p>

          <div class="info-box">
            <strong>문의 유형:</strong> ${subject}<br>
            <strong>접수 시간:</strong> ${new Date().toLocaleString('ko-KR')}
          </div>

          <p>저희 팀이 24시간 이내에 답변을 드릴 예정입니다.</p>
          <p>긴급한 문의사항이 있으시면 <a href="mailto:support@webtrends.com">support@webtrends.com</a>으로 직접 연락 주세요.</p>

          <div class="footer">
            <p>감사합니다.</p>
            <p>&copy; 2024 Web Trends Timeline. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: '문의가 접수되었습니다 - Web Trends Timeline',
    html,
  });
};

// Payment success email
export const sendPaymentSuccessEmail = async (email: string, name: string) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .success-icon { font-size: 60px; text-align: center; margin: 20px 0; }
        .features { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="success-icon">👑</div>
          <h1>프리미엄 결제가 완료되었습니다!</h1>
        </div>
        <div class="content">
          <p>축하합니다, ${name}님!</p>
          <p>Web Trends Timeline 프리미엄 플랜 결제가 성공적으로 완료되었습니다.</p>

          <div class="features">
            <h3>이제 사용 가능한 프리미엄 기능:</h3>
            <ul>
              <li>✨ 모든 국가 데이터 접근 (한국, 미국, 일본, 중국)</li>
              <li>📊 무제한 비교 분석</li>
              <li>📥 PDF/Excel 내보내기</li>
              <li>🚀 API 액세스</li>
              <li>💬 우선 고객 지원</li>
            </ul>
          </div>

          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/timeline" class="button">
            프리미엄 기능 사용하기
          </a>

          <p><strong>결제 정보:</strong></p>
          <ul>
            <li>플랜: 프리미엄 월간 구독</li>
            <li>금액: $9.99/월</li>
            <li>다음 결제일: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR')}</li>
          </ul>

          <p>구독 관리는 <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/account">내 계정</a> 페이지에서 하실 수 있습니다.</p>

          <div class="footer">
            <p>즐거운 경험이 되시길 바랍니다!</p>
            <p>&copy; 2024 Web Trends Timeline. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: '🎉 프리미엄 결제 완료 - Web Trends Timeline',
    html,
  });
};

export default {
  sendEmail,
  sendWelcomeEmail,
  sendContactConfirmationEmail,
  sendPaymentSuccessEmail,
};
