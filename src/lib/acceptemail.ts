import { transporter } from "./transporter";

// (Keep your existing sendConfirmationEmail function here...)

export async function sendAcceptanceEmail(
  toEmail: string,
  participantName: string
): Promise<void> {
  const mailOptions = {
    from: `"Association of Bengal" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Stall Booking Accepted: ${participantName} - International Kolkata Book Fair 2026`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1e1b18; padding: 24px; max-width: 600px; margin: auto; border: 1px solid #e0bfbf; border-radius: 12px; background-color: #fff8f5;">
        <h2 style="color: #570013; margin-top: 0; font-size: 22px; border-bottom: 2px solid #e0bfbf; padding-bottom: 10px;">
          International Kolkata Book Fair 2026
        </h2>
        <p style="font-size: 15px; line-height: 1.5;">Dear <strong>${participantName}</strong>,</p>
        <p style="font-size: 15px; line-height: 1.5;">
          We are delighted to inform you that your stall booking application has been <strong>ACCEPTED</strong> by our administration team.
        </p>
        <div style="background-color: #e6f4ea; border-left: 4px solid #137333; padding: 15px; border-radius: 6px; font-size: 14px; margin: 20px 0; color: #137333; font-weight: bold;">
          Application Status: ACCEPTED
        </div>
        <p style="font-size: 15px; line-height: 1.5;">
          Congratulations! Your stall setup request has been approved. Further instructions regarding your exact stall allotment, layout positioning, and payment procedures will be shared with you shortly.
        </p>
        <p style="margin-top: 30px; font-size: 13px; color: #775a19; line-height: 1.4;">
          Best regards,<br/>
          <strong>Association of Bengal</strong><br/>
          <span style="font-size: 11px; color: #999;">This is an automated notification. Please do not reply directly to this email.</span>
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendRejectionEmail(
  toEmail: string,
  participantName: string
): Promise<void> {
  const mailOptions = {
    from: `"Association of Bengal" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Stall Booking Status Update: ${participantName} - International Kolkata Book Fair 2026`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1e1b18; padding: 24px; max-width: 600px; margin: auto; border: 1px solid #e0bfbf; border-radius: 12px; background-color: #fff8f5;">
        <h2 style="color: #570013; margin-top: 0; font-size: 22px; border-bottom: 2px solid #e0bfbf; padding-bottom: 10px;">
          International Kolkata Book Fair 2026
        </h2>
        <p style="font-size: 15px; line-height: 1.5;">Dear <strong>${participantName}</strong>,</p>
        <p style="font-size: 15px; line-height: 1.5;">
          Thank you for submitting your application for the International Kolkata Book Fair 2026.
        </p>
        <div style="background-color: #fce8e6; border-left: 4px solid #c5221f; padding: 15px; border-radius: 6px; font-size: 14px; margin: 20px 0; color: #c5221f; font-weight: bold;">
          Application Status: REJECTED
        </div>
        <p style="font-size: 15px; line-height: 1.5;">
          Regrettably, we are unable to approve your stall application at this time due to high demand, spatial limitations, or specific criteria constraints. We deeply appreciate your interest and participation effort.
        </p>
        <p style="margin-top: 30px; font-size: 13px; color: #775a19; line-height: 1.4;">
          Best regards,<br/>
          <strong>Association of Bengal</strong><br/>
          <span style="font-size: 11px; color: #999;">This is an automated notification. Please do not reply directly to this email.</span>
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}