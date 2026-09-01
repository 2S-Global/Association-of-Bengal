
import { transporter } from "./transporter";

export async function sendConfirmationEmail(
  toEmail: string,
  participantName: string,
  spaceReq: string,
  date: string,
  place: string
): Promise<void> {
  const mailOptions = {
    from: `"Association of Bengal for Literature and Culture" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Stall Booking Request Submitted - International Kolkata Book Fair 2026",
    html: `
      <div style="font-family: Arial, sans-serif; color: #1e1b18; padding: 24px; max-width: 600px; margin: auto; border: 1px solid #e0bfbf; border-radius: 12px; background-color: #fff8f5;">
        
        <!-- Header Section -->
        <div style="text-align: center; border-bottom: 2px solid #e0bfbf; padding-bottom: 15px; margin-bottom: 20px;">
          <h2 style="color: #570013; margin: 0; font-size: 18px; text-transform: uppercase; font-family: 'Playfair_Display', serif;">
            ASSOCIATION OF BENGAL FOR LITERATURE AND CULTURE
          </h2>
        </div>

        <h3 style="color: #570013; margin-top: 0; font-size: 18px;">
          Stall Booking Request Received Successfully
        </h3>

        <p style="font-size: 15px; line-height: 1.5;">Dear <strong>${participantName}</strong>,</p>
        
        <p style="font-size: 15px; line-height: 1.5;">
          Thank you for submitting your stall booking request for participation in the <strong>International Kolkata Book Fair 2026</strong> through the <strong>Association of Bengal for Literature and Culture</strong>. We have successfully registered your application form and uploaded documents.
        </p>

        <!-- Status Notice Box -->
        <div style="background-color: #fef3c7; border-left: 4px solid #d97706; padding: 15px; border-radius: 6px; font-size: 14px; margin: 20px 0; color: #92400e;">
          <strong>Current Status: Pending Admin Confirmation</strong><br/>
          Your booking request is currently under review by our administration team. You will receive a final confirmation update shortly.
        </div>

        <!-- Application Summary Card -->
        <div style="background-color: #ffffff; border: 1px solid #e0bfbf; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #570013; margin-top: 0; font-size: 16px; margin-bottom: 10px;">Booking Request Summary</h3>
          <p style="margin: 6px 0; font-size: 14px;"><strong>Selected Stall Area:</strong> ${spaceReq} sq. metre</p>
          <p style="margin: 6px 0; font-size: 14px;"><strong>Submission Date:</strong> ${date}</p>
          <p style="margin: 6px 0; font-size: 14px;"><strong>Location/Place:</strong> ${place}</p>
        </div>

       
        <!-- Footer -->
        <p style="margin-top: 30px; font-size: 13px; color: #775a19; line-height: 1.4;">
          Best regards,<br/>
          <strong>Association of Bengal for Literature and Culture</strong><br/>
          <span style="font-size: 11px; color: #999;">This is an automated notification. Please do not reply directly to this email.</span>
        </p>

      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}