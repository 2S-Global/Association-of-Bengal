import { transporter } from "./transporter";

/**
 * Nomination Acceptance Email (Simple & Warm English)
 */
export async function sendAcceptanceEmail(
  toEmail: string,
  candidateName: string,
  electionName: string,
  remark?: string
): Promise<void> {
  const mailOptions = {
    from: `"Association of Bengal for Literature and Culture" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Your Nomination is Approved: ${electionName}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1e1b18; padding: 28px; max-width: 600px; margin: auto; border: 1px solid #e0bfbf; border-radius: 16px; background-color: #fff8f5;">
        <div style="text-align: center; border-bottom: 2px solid #e0bfbf; padding-bottom: 15px; margin-bottom: 20px;">
          <h2 style="color: #570013; margin: 0; font-size: 16px; text-transform: uppercase; font-family: serif; letter-spacing: 1px;">
            ASSOCIATION OF BENGAL FOR LITERATURE AND CULTURE
          </h2>
        </div>
        <h3 style="color: #570013; margin-top: 0; font-size: 20px; font-family: serif;">Nomination Approved!</h3>
        <p style="font-size: 15px; line-height: 1.6;">Dear <strong>${candidateName}</strong>,</p>
        <p style="font-size: 15px; line-height: 1.6;">
          We are very happy to let you know that your nomination for <strong>${electionName}</strong> has been checked and officially <strong>APPROVED</strong>.
        </p>
        <div style="background-color: #e6f4ea; border-left: 4px solid #137333; padding: 16px; border-radius: 8px; font-size: 14px; margin: 20px 0; color: #137333; font-weight: bold;">
          Status: ACCEPTED FOR ELECTION
        </div>
        ${
          remark
            ? `<div style="background-color: #eef2ff; border-left: 4px solid #4f46e5; padding: 16px; border-radius: 8px; font-size: 14px; margin: 20px 0; color: #312e81; line-height: 1.5;"><strong>Admin Note:</strong><br/>${remark}</div>`
            : ""
        }
        <p style="font-size: 15px; line-height: 1.6;">
          Thank you for stepping up to serve our community. We wish you the best of luck with your campaign!
        </p>
        <p style="margin-top: 35px; font-size: 13px; color: #775a19; line-height: 1.5;">
          Warm regards,<br/>
          <strong>Association of Bengal for Literature and Culture</strong>
        </p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
}

/**
 * Nomination Rejection Email (Simple, Kind, and Encouraging English)
 */
export async function sendRejectionEmail(
  toEmail: string,
  candidateName: string,
  electionName: string,
  remark?: string
): Promise<void> {
  const mailOptions = {
    from: `"Association of Bengal for Literature and Culture" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Update on Your Nomination: ${electionName}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1e1b18; padding: 28px; max-width: 600px; margin: auto; border: 1px solid #e0bfbf; border-radius: 16px; background-color: #fff8f5;">
        <div style="text-align: center; border-bottom: 2px solid #e0bfbf; padding-bottom: 15px; margin-bottom: 20px;">
          <h2 style="color: #570013; margin: 0; font-size: 16px; text-transform: uppercase; font-family: serif; letter-spacing: 1px;">
            ASSOCIATION OF BENGAL FOR LITERATURE AND CULTURE
          </h2>
        </div>
        <h3 style="color: #570013; margin-top: 0; font-size: 20px; font-family: serif;">Nomination Status Update</h3>
        <p style="font-size: 15px; line-height: 1.6;">Dear <strong>${candidateName}</strong>,</p>
        <p style="font-size: 15px; line-height: 1.6;">
          Thank you very much for submitting your nomination for <strong>${electionName}</strong>. We truly appreciate your willingness to help and serve our association.
        </p>
        <p style="font-size: 15px; line-height: 1.6;">
          After checking all applications based on our rules, we are sorry to inform you that your nomination cannot be approved for this election.
        </p>
        <div style="background-color: #fce8e6; border-left: 4px solid #c5221f; padding: 16px; border-radius: 8px; font-size: 14px; margin: 20px 0; color: #c5221f; font-weight: bold;">
          Status: NOT APPROVED FOR THIS TERM
        </div>
        ${
          remark
            ? `<div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; border-radius: 8px; font-size: 14px; margin: 20px 0; color: #991b1b; line-height: 1.5;"><strong>Reason / Note from Admin:</strong><br/>${remark}</div>`
            : ""
        }
        <p style="font-size: 15px; line-height: 1.6;">
          Please do not be discouraged. This decision is only for this current term and does not affect your value in our community. We hope you will continue to support us in future activities.
        </p>
        <p style="margin-top: 35px; font-size: 13px; color: #775a19; line-height: 1.5;">
          Thank you for your understanding,<br/>
          <strong>Association of Bengal for Literature and Culture</strong>
        </p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
}

/**
 * Nomination Submission Confirmation Email (Simple & Clear English)
 */
export async function sendNominationSubmissionEmail(
  toEmail: string,
  candidateName: string,
  electionName: string
): Promise<void> {
  const mailOptions = {
    from: `"Association of Bengal for Literature and Culture" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Nomination Received: ${electionName}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1e1b18; padding: 28px; max-width: 600px; margin: auto; border: 1px solid #e0bfbf; border-radius: 16px; background-color: #fff8f5;">
        <div style="text-align: center; border-bottom: 2px solid #e0bfbf; padding-bottom: 15px; margin-bottom: 20px;">
          <h2 style="color: #570013; margin: 0; font-size: 16px; text-transform: uppercase; font-family: serif; letter-spacing: 1px;">
            ASSOCIATION OF BENGAL FOR LITERATURE AND CULTURE
          </h2>
        </div>
        <h3 style="color: #570013; margin-top: 0; font-size: 20px; font-family: serif;">Nomination Successfully Received</h3>
        <p style="font-size: 15px; line-height: 1.6;">Dear <strong>${candidateName}</strong>,</p>
        <p style="font-size: 15px; line-height: 1.6;">
          We have successfully received your nomination form for <strong>${electionName}</strong>. Thank you for taking part in our election process.
        </p>
        <div style="background-color: #eef2ff; border-left: 4px solid #4f46e5; padding: 16px; border-radius: 8px; font-size: 14px; margin: 20px 0; color: #312e81; font-weight: bold;">
          Status: PENDING ADMIN REVIEW
        </div>
        <p style="font-size: 15px; line-height: 1.6;">
          Our team will check your details soon and update you shortly. Thank you for your patience.
        </p>
        <p style="margin-top: 35px; font-size: 13px; color: #775a19; line-height: 1.5;">
          Warm regards,<br/>
          <strong>Association of Bengal for Literature and Culture</strong>
        </p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
}