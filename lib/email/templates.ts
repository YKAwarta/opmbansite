/**
 * Email Templates for THE OPM&BAN Club
 */

type WelcomeEmailParams = {
    fullName: string
    email: string
    password: string
    loginUrl: string
    useEmbeddedLogo?: boolean  // If true, uses cid:logo instead of URL
}

/**
 * Welcome email template for new members
 */
export function getWelcomeEmail(params: WelcomeEmailParams): string {
    const { fullName, email, password, loginUrl, useEmbeddedLogo = false } = params

    // Use embedded logo (cid:logo) or external URL
    const logoUrl = useEmbeddedLogo
        ? 'cid:logo'
        : `${process.env.NEXT_PUBLIC_APP_URL}/club_logo_email.png`

    const currentYear = new Date().getFullYear()

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to The OPM & BAN Club!</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', 'Helvetica', sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 40px 0;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #093968 0%, #0abd62 100%); padding: 40px 30px; text-align: center;">
              <!-- Club Logo -->
              <div style="width: 100px; height: 100px; background-color: white; border-radius: 50%; margin: 0 auto 20px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.15);">
                <img src="${logoUrl}" alt="OPM&BAN Club Logo" style="width: 100%; height: 100%; display: block; object-fit: cover;">
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Welcome to The OPM&BAN Club!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">You have been accepted and your account has been created!</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear <strong>${fullName}</strong>,
              </p>
              <p style="color: #666; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">
                Congratulations on your acceptance into The OPM & BAN Club! We're excited to have you as part of The OPM & BAN Club at Alfaisal University! Your account has been successfully created, and you can now access your digital wallet and club resources.
              </p>
              
              <!-- Credentials Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 8px; border: 2px solid #0abd62; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 25px;">
                    <h2 style="color: #093968; margin: 0 0 20px 0; font-size: 18px; font-weight: 700;">🔐 Your Login Credentials</h2>
                    
                    <table width="100%" cellpadding="8" cellspacing="0" border="0">
                      <tr>
                        <td style="color: #666; font-size: 14px; font-weight: 600; padding: 8px 0;">Website:</td>
                        <td style="color: #333; font-size: 14px; padding: 8px 0;">
                          <a href="${loginUrl}" style="color: #0abd62; text-decoration: none; font-weight: 600;">${loginUrl}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #666; font-size: 14px; font-weight: 600; padding: 8px 0; border-top: 1px solid #dee2e6;">Email:</td>
                        <td style="color: #333; font-size: 14px; padding: 8px 0; border-top: 1px solid #dee2e6; font-family: 'Courier New', monospace;">
                          ${email}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #666; font-size: 14px; font-weight: 600; padding: 8px 0; border-top: 1px solid #dee2e6;">Password:</td>
                        <td style="color: #333; font-size: 14px; padding: 8px 0; border-top: 1px solid #dee2e6; font-family: 'Courier New', monospace; background-color: #fff; border-radius: 4px; padding: 10px;">
                          <strong style="color: #093968;">${password}</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #093968 0%, #0abd62 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(10, 189, 98, 0.3);">
                      Login to Your Account →
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Important Notice -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff3cd; border-left: 4px solid #f0ba1b; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.6;">
                      <strong>⚠️ IMPORTANT:</strong><br>
                      Please change your password immediately after your first login by visiting your dashboard settings. Never share your credentials with anyone.
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- What's Next Section -->
              <h3 style="color: #093968; font-size: 18px; margin: 0 0 15px 0; font-weight: 700;">What's Next?</h3>
              <ul style="color: #666; font-size: 15px; line-height: 1.8; padding-left: 20px; margin: 0 0 30px 0;">
                <li>Log in to your account and explore your digital wallet</li>
                <li>Update your profile and change your password</li>
                <li>Join our Discord server for updates and events</li>
                <li>Check out upcoming workshops and certification programs</li>
              </ul>
              
              <p style="color: #666; font-size: 15px; line-height: 1.6; margin: 0;">
                If you have any questions or need assistance, feel free to reach out to our team.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 2px solid #e9ecef;">
              <p style="color: #093968; font-weight: 700; margin: 0 0 10px 0; font-size: 16px;">
                The OPM & BAN Club
              </p>
              <p style="color: #666; font-size: 14px; margin: 0 0 15px 0;">
                Operations & Project Management | Business Analytics<br>
                Alfaisal University
              </p>
              <div style="margin: 15px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: #0abd62; text-decoration: none; margin: 0 10px; font-size: 14px;">Website</a>
                <span style="color: #dee2e6;">|</span>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/support" style="color: #0abd62; text-decoration: none; margin: 0 10px; font-size: 14px;">Support</a>
                <span style="color: #dee2e6;">|</span>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact" style="color: #0abd62; text-decoration: none; margin: 0 10px; font-size: 14px;">Contact</a>
              </div>
              <p style="color: #999; font-size: 12px; margin: 15px 0 0 0;">
                © ${currentYear} The OPM & BAN Club. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}