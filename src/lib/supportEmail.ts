import { transporter } from "./transporter";

export async function sendSupportResponseEmail(
  toEmail: string,
  userName: string,
  trackingId: string,
  subject: string,
  category: string,
  status: string,
  adminReply: string
): Promise<void> {
  // Determine dynamic badge styling based on ticket status
  let statusBg = "#fef3c7"; // amber for pending
  let statusColor = "#92400e";
  let statusBorder = "#f59e0b";

  if (status === "IN_PROGRESS") {
    statusBg = "#eff6ff";
    statusColor = "#1e40af";
    statusBorder = "#3b82f6";
  } else if (status === "RESOLVED" || status === "CLOSED") {
    statusBg = "#ecfdf5";
    statusColor = "#065f46";
    statusBorder = "#10b981";
  }

  const mailOptions = {
    from: `"Association of Bengal for Literature and Culture" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Support Ticket Update: [${trackingId}] - ${subject}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1f2937; padding: 32px 16px; max-width: 600px; margin: auto; background-color: #f9fafb;">
        
        <!-- Main Container Card -->
        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Header Banner -->
          <div style="background-color: #570013; padding: 24px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-family: serif;">
              Association of Bengal for Literature and Culture
            </h2>
            <p style="color: #ffccd5; margin: 6px 0 0 0; font-size: 12px; font-weight: 500;">
              Support & Grievance Control Center
            </p>
          </div>

          <!-- Body Content Area -->
          <div style="padding: 32px 24px;">
            
            <p style="font-size: 16px; line-height: 1.5; margin-top: 0; color: #111827;">
              Dear <strong>${userName}</strong>,
            </p>
            
            <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">
              An administrator has reviewed your support inquiry and posted an official update regarding your ticket. Below are the details of your request:
            </p>

            <!-- Ticket Meta Summary Box -->
            <div style="background-color: #fdf2f4; border: 1px solid #f2d3d9; padding: 16px; border-radius: 10px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr>
                  <td style="color: #775a19; font-weight: bold; padding-bottom: 6px; width: 35%;">Tracking ID:</td>
                  <td style="color: #570013; font-family: monospace; font-weight: bold; padding-bottom: 6px;">${trackingId}</td>
                </tr>
                <tr>
                  <td style="color: #775a19; font-weight: bold; padding-bottom: 6px;">Category:</td>
                  <td style="color: #374151; padding-bottom: 6px;">${category || "General Inquiry"}</td>
                </tr>
                <tr>
                  <td style="color: #775a19; font-weight: bold;">Subject:</td>
                  <td style="color: #374151; font-weight: 500;">${subject}</td>
                </tr>
              </table>
            </div>

            <!-- Status Indicator Banner -->
            <div style="background-color: ${statusBg}; border-left: 4px solid ${statusBorder}; padding: 12px 16px; border-radius: 6px; font-size: 13px; margin: 20px 0; color: ${statusColor}; font-weight: bold; display: flex; align-items: center;">
              Current Status: &nbsp;<span style="text-transform: uppercase; letter-spacing: 0.5px;">${status.replace("_", " ")}</span>
            </div>

            <!-- Admin Remark Box -->
            ${
              adminReply
                ? `
              <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-top: 3px solid #570013; padding: 20px; border-radius: 8px; margin: 24px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
                <h4 style="color: #570013; margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px;">
                  Official Admin Remark / Response
                </h4>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #1f2937; white-space: pre-wrap;">${adminReply}</p>
              </div>
            `
                : ""
            }

            <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin-top: 24px;">
              You can review your complete conversation thread history or reply by logging into your member support portal dashboard.
            </p>

            <!-- Call to Action Button -->
            <div style="text-align: center; margin: 30px 0 10px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/complaint" style="background-color: #570013; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-size: 12px; font-weight: bold; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
                Access Support Dashboard
              </a>
            </div>

          </div>

          <!-- Footer Area -->
          <div style="background-color: #f8fafc; padding: 20px 24px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #6b7280; line-height: 1.5;">
              Best regards,<br/>
              <strong style="color: #374151;">Association of Bengal for Literature and Culture</strong>
            </p>
            <p style="margin: 10px 0 0 0; font-size: 11px; color: #9ca3af;">
              This is an automated system notification. Please do not reply directly to this email.
            </p>
          </div>

        </div>

      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}