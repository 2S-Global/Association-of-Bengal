import { transporter } from "./transporter"; // Adjust the import path to your transporter file

/**
 * Sends a Membership Acceptance Email to the user
 */
export async function sendAcceptanceEmail(
  toEmail: string,
  memberName: string,
  amount?: string,       // Optional membership fee if applicable
  remark?: string        // Optional admin remarks/instructions
): Promise<void> {
  const mailOptions = {
    from: `"Association of Bengal for Literature and Culture" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Membership Application Approved: Welcome, ${memberName}!`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1e1b18; padding: 24px; max-width: 600px; margin: auto; border: 1px solid #e0bfbf; border-radius: 12px; background-color: #fff8f5;">
        
        <!-- Header Section -->
        <div style="text-align: center; border-bottom: 2px solid #e0bfbf; padding-bottom: 15px; margin-bottom: 20px;">
          <h2 style="color: #570013; margin: 0; font-size: 18px; text-transform: uppercase; font-family: serif;">
            ASSOCIATION OF BENGAL FOR LITERATURE AND CULTURE
          </h2>
        </div>

        <h3 style="color: #570013; margin-top: 0; font-size: 18px;">
          Membership Status Update
        </h3>

        <p style="font-size: 15px; line-height: 1.5;">Dear <strong>${memberName}</strong>,</p>
        
        <p style="font-size: 15px; line-height: 1.5;">
          We are delighted to inform you that your membership application has been reviewed and <strong>APPROVED</strong> by the administration team of the <strong>Association of Bengal for Literature and Culture</strong>.
        </p>

        <div style="background-color: #e6f4ea; border-left: 4px solid #137333; padding: 15px; border-radius: 6px; font-size: 14px; margin: 20px 0; color: #137333; font-weight: bold;">
          Membership Status: APPROVED
        </div>

        <!-- Optional Amount Card -->
        ${
          amount
            ? `
          <div style="background-color: #ffffff; border: 1px solid #e0bfbf; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #570013; margin-top: 0; font-size: 16px; margin-bottom: 10px;">Membership Fee Details</h3>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Payable Amount:</strong> ₹${amount}</p>
          </div>
        `
            : ""
        }

        <!-- Conditional Remark Box -->
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
          Welcome aboard! You can now log into your account to access all member-exclusive privileges, events, and resources.
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

/**
 * Sends a Membership Rejection Email to the user
 */
export async function sendRejectionEmail(
  toEmail: string,
  memberName: string,
  remark?: string        // Optional reason/feedback for rejection
): Promise<void> {
  const mailOptions = {
    from: `"Association of Bengal for Literature and Culture" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Membership Application Status Update: ${memberName}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1e1b18; padding: 24px; max-width: 600px; margin: auto; border: 1px solid #e0bfbf; border-radius: 12px; background-color: #fff8f5;">
        
        <!-- Header Section -->
        <div style="text-align: center; border-bottom: 2px solid #e0bfbf; padding-bottom: 15px; margin-bottom: 20px;">
          <h2 style="color: #570013; margin: 0; font-size: 18px; text-transform: uppercase; font-family: serif;">
            ASSOCIATION OF BENGAL FOR LITERATURE AND CULTURE
          </h2>
        </div>

        <h3 style="color: #570013; margin-top: 0; font-size: 18px;">
          Membership Status Update
        </h3>

        <p style="font-size: 15px; line-height: 1.5;">Dear <strong>${memberName}</strong>,</p>
        
        <p style="font-size: 15px; line-height: 1.5;">
          Thank you for applying for membership with the <strong>Association of Bengal for Literature and Culture</strong>.
        </p>

        <div style="background-color: #fce8e6; border-left: 4px solid #c5221f; padding: 15px; border-radius: 6px; font-size: 14px; margin: 20px 0; color: #c5221f; font-weight: bold;">
          Membership Status: NOT APPROVED
        </div>

        <p style="font-size: 15px; line-height: 1.5;">
          Regrettably, we are unable to approve your membership application at this time based on our current review guidelines or criteria.
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
          We deeply appreciate your interest in our association and wish you the very best.
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