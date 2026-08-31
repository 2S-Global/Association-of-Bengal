import { transporter } from "./transporter";

// (Keep your existing sendConfirmationEmail function here...)

export async function sendAcceptanceEmail(
  toEmail: string,
  participantName: string,
  amount: string,        // Added amount parameter
  remark?: string        // Optional remark/instructions parameter for acceptance
): Promise<void> {
  const mailOptions = {
    from: `"Association of Bengal for Literature and Culture" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Stall Booking Accepted: ${participantName} - International Kolkata Book Fair 2026`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1e1b18; padding: 24px; max-width: 600px; margin: auto; border: 1px solid #e0bfbf; border-radius: 12px; background-color: #fff8f5;">
        
        <!-- Header Section -->
        <div style="text-align: center; border-bottom: 2px solid #e0bfbf; padding-bottom: 15px; margin-bottom: 20px;">
          <h2 style="color: #570013; margin: 0; font-size: 18px; text-transform: uppercase; font-family: serif;">
            ASSOCIATION OF BENGAL FOR LITERATURE AND CULTURE
          </h2>
        </div>

        <h3 style="color: #570013; margin-top: 0; font-size: 18px;">
          International Kolkata Book Fair 2026
        </h3>

        <p style="font-size: 15px; line-height: 1.5;">Dear <strong>${participantName}</strong>,</p>
        
        <p style="font-size: 15px; line-height: 1.5;">
          We are delighted to inform you that your stall booking application has been reviewed and <strong>ACCEPTED</strong> by the administration team of the <strong>Association of Bengal for Literature and Culture</strong>.
        </p>

        <div style="background-color: #e6f4ea; border-left: 4px solid #137333; padding: 15px; border-radius: 6px; font-size: 14px; margin: 20px 0; color: #137333; font-weight: bold;">
          Application Status: ACCEPTED
        </div>

        <!-- Amount Card -->
        <div style="background-color: #ffffff; border: 1px solid #e0bfbf; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #570013; margin-top: 0; font-size: 16px; margin-bottom: 10px;">Payment Details</h3>
          <p style="margin: 6px 0; font-size: 14px;"><strong>Total Payable Amount:</strong> ₹${amount}</p>
        </div>

        <!-- Conditional Remark Box for Acceptance -->
        ${
          remark
            ? `
          <div style="background-color: #eef2ff; border-left: 4px solid #4f46e5; padding: 15px; border-radius: 6px; font-size: 14px; margin: 20px 0; color: #312e81; line-height: 1.5;">
            <strong>Admin Remarks / Instructions:</strong><br/>
            ${remark}
          </div>
        `
            : ""
        }

        <p style="font-size: 15px; line-height: 1.5;">
          Congratulations! Your stall setup request has been approved. Further instructions regarding your exact stall allotment, layout positioning, and payment procedures will be shared with you shortly.
        </p>

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

export async function sendRejectionEmail(
  toEmail: string,
  participantName: string,
  remark?: string        // Optional remark/reason parameter for rejection
): Promise<void> {
  const mailOptions = {
    from: `"Association of Bengal for Literature and Culture" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Stall Booking Status Update: ${participantName} - International Kolkata Book Fair 2026`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1e1b18; padding: 24px; max-width: 600px; margin: auto; border: 1px solid #e0bfbf; border-radius: 12px; background-color: #fff8f5;">
        
        <!-- Header Section -->
        <div style="text-align: center; border-bottom: 2px solid #e0bfbf; padding-bottom: 15px; margin-bottom: 20px;">
          <h2 style="color: #570013; margin: 0; font-size: 18px; text-transform: uppercase; font-family: serif;">
            ASSOCIATION OF BENGAL FOR LITERATURE AND CULTURE
          </h2>
        </div>

        <h3 style="color: #570013; margin-top: 0; font-size: 18px;">
          International Kolkata Book Fair 2026
        </h3>

        <p style="font-size: 15px; line-height: 1.5;">Dear <strong>${participantName}</strong>,</p>
        
        <p style="font-size: 15px; line-height: 1.5;">
          Thank you for submitting your application for the International Kolkata Book Fair 2026 through the <strong>Association of Bengal for Literature and Culture</strong>.
        </p>

        <div style="background-color: #fce8e6; border-left: 4px solid #c5221f; padding: 15px; border-radius: 6px; font-size: 14px; margin: 20px 0; color: #c5221f; font-weight: bold;">
          Application Status: REJECTED
        </div>

        <p style="font-size: 15px; line-height: 1.5;">
          Regrettably, we are unable to approve your stall application at this time due to high demand, spatial limitations, or specific criteria constraints.
        </p>

        <!-- Conditional Remark Box for Rejection -->
        ${
          remark
            ? `
          <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; border-radius: 6px; font-size: 14px; margin: 20px 0; color: #991b1b; line-height: 1.5;">
            <strong>Admin Remarks / Reason:</strong><br/>
            ${remark}
          </div>
        `
            : ""
        }

        <p style="font-size: 15px; line-height: 1.5;">
          We deeply appreciate your interest and participation effort.
        </p>

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