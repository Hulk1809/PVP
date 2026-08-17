import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'voquocthang1809@gmail.com',
    pass: 'tilv lzjg qghn ndkf',
  },
});

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, playerName, username, password, bracketName } = req.body || {};

  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Thiếu thông tin email hoặc tài khoản' });
  }

  const mailOptions = {
    from: '"Tông Môn Tranh Bá - Đấu La Đại Lục" <voquocthang1809@gmail.com>',
    to: email,
    subject: `⚔️ [TÔNG MÔN TRANH BÁ] Tài Khoản Tuyển Thủ: ${playerName || username}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #090d16; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; overflow: hidden; color: #f8fafc;">
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 24px; text-align: center; border-bottom: 2px solid #38bdf8;">
          <h1 style="margin: 0; font-size: 22px; color: #ffffff; letter-spacing: 2px; text-transform: uppercase;">⚔️ TÔNG MÔN TRANH BÁ ⚔️</h1>
          <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 12px; letter-spacing: 1px;">ĐẤU LA ĐẠI LỤC PVP PLATFORM 2026</p>
        </div>

        <!-- Body Content -->
        <div style="padding: 24px;">
          <p style="font-size: 15px; color: #cbd5e1; margin-top: 0;">Xin chào Hồn Sư <strong>${playerName || username}</strong>,</p>
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">
            Ban Tổ Chức giải đấu <strong>Tông Môn Tranh Bá</strong> xin gửi đến bạn thông tin tài khoản đăng nhập để tham gia thi đấu và thực hiện quyền <strong>CẤM TƯỚNG (BAN HERO)</strong> cho các trận đấu của bạn:
          </p>

          <!-- Credentials Box -->
          <div style="background: #131b2e; border: 1px solid #38bdf8; border-radius: 12px; padding: 18px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #94a3b8; font-size: 13px; width: 140px;">Tên Tuyển Thủ:</td>
                <td style="padding: 6px 0; color: #38bdf8; font-size: 14px; font-weight: bold;">${playerName || username}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8; font-size: 13px;">Bảng Đấu:</td>
                <td style="padding: 6px 0; color: #f8fafc; font-size: 13px;">${bracketName || 'Giải Đấu Chính'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8; font-size: 13px;">Tên Đăng Nhập:</td>
                <td style="padding: 6px 0; color: #ffffff; font-size: 15px; font-family: monospace; font-weight: bold; background: rgba(255,255,255,0.08); padding: 4px 8px; border-radius: 6px; display: inline-block;">${username}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8; font-size: 13px;">Mật Khẩu:</td>
                <td style="padding: 6px 0; color: #facc15; font-size: 15px; font-family: monospace; font-weight: bold; background: rgba(255,255,255,0.08); padding: 4px 8px; border-radius: 6px; display: inline-block;">${password}</td>
              </tr>
            </table>
          </div>

          <!-- Instructions -->
          <div style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; padding: 12px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 0; color: #fca5a5; font-size: 12px; font-weight: bold;">⚠️ QUY ĐỊNH CẤM TƯỚNG QUAN TRỌNG:</p>
            <ul style="margin: 6px 0 0 0; padding-left: 20px; color: #fca5a5; font-size: 12px; line-height: 1.5;">
              <li>Bạn chỉ có quyền Cấm Tướng tại trận đấu của chính mình ở bảng đấu bạn tham gia.</li>
              <li>Nếu giành chiến thắng và đi tiếp, bạn sẽ tiếp tục được quyền Cấm Tướng ở vòng sau.</li>
              <li><strong>Mỗi trận đấu bạn chỉ được thực hiện Cấm Tướng 1 LẦN DUY NHẤT và KHÔNG ĐƯỢC CHỈNH SỬA sau khi đã gửi.</strong></li>
            </ul>
          </div>

          <!-- Action Button -->
          <div style="text-align: center; margin: 25px 0 10px 0;">
            <a href="https://pvp-rho.vercel.app" style="background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%); color: #0f172a; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 14px rgba(56, 189, 248, 0.4);">
              👉 TRUY CẬP VÀO ĐẤU TRƯỜNG NGAY
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #050811; padding: 14px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05); font-size: 11px; color: #64748b;">
          Email tự động được gửi từ Hệ Thống Giải Đấu Đấu La Đại Lục. Vui lòng bảo mật mật khẩu của bạn.
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Đã gửi tài khoản về email thành công' });
  } catch (error: any) {
    console.error('Lỗi khi gửi email:', error);
    return res.status(500).json({ error: error.message || 'Không thể gửi email' });
  }
}
