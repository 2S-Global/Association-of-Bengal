
// import { transporter } from "./transporter";

// export async function sendConfirmationEmail(
//   toEmail: string,
//   participantName: string,
//   spaceReq: string,
//   date: string,
//   place: string
// ): Promise<void> {
//   const mailOptions = {
//     from: `"Association of Bengal for Literature and Culture" <${process.env.EMAIL_USER}>`,
//     to: toEmail,
//     subject: "Stall Booking Request Submitted - International Kolkata Book Fair 2026",
//     html: `
//       <div style="font-family: Arial, sans-serif; color: #1e1b18; padding: 24px; max-width: 600px; margin: auto; border: 1px solid #e0bfbf; border-radius: 12px; background-color: #fff8f5;">
        
//         <!-- Header Section -->
//         <div style="text-align: center; border-bottom: 2px solid #e0bfbf; padding-bottom: 15px; margin-bottom: 20px;">
//           <h2 style="color: #570013; margin: 0; font-size: 18px; text-transform: uppercase; font-family: 'Playfair_Display', serif;">
//             ASSOCIATION OF BENGAL FOR LITERATURE AND CULTURE
//           </h2>
//         </div>

//         <h3 style="color: #570013; margin-top: 0; font-size: 18px;">
//           Stall Booking Request Received Successfully
//         </h3>

//         <p style="font-size: 15px; line-height: 1.5;">Dear <strong>${participantName}</strong>,</p>
        
//         <p style="font-size: 15px; line-height: 1.5;">
//           Thank you for submitting your stall booking request for participation in the <strong>International Kolkata Book Fair 2026</strong> through the <strong>Association of Bengal for Literature and Culture</strong>. We have successfully registered your application form and uploaded documents.
//         </p>

//         <!-- Status Notice Box -->
//         <div style="background-color: #fef3c7; border-left: 4px solid #d97706; padding: 15px; border-radius: 6px; font-size: 14px; margin: 20px 0; color: #92400e;">
//           <strong>Current Status: Pending Admin Confirmation</strong><br/>
//           Your booking request is currently under review by our administration team. You will receive a final confirmation update shortly.
//         </div>

//         <!-- Application Summary Card -->
//         <div style="background-color: #ffffff; border: 1px solid #e0bfbf; padding: 16px; border-radius: 8px; margin: 20px 0;">
//           <h3 style="color: #570013; margin-top: 0; font-size: 16px; margin-bottom: 10px;">Booking Request Summary</h3>
//           <p style="margin: 6px 0; font-size: 14px;"><strong>Selected Stall Area:</strong> ${spaceReq} sq. metre</p>
//           <p style="margin: 6px 0; font-size: 14px;"><strong>Submission Date:</strong> ${date}</p>
//           <p style="margin: 6px 0; font-size: 14px;"><strong>Location/Place:</strong> ${place}</p>
//         </div>

//         <!-- Footer -->
//         <p style="margin-top: 30px; font-size: 13px; color: #775a19; line-height: 1.4;">
//           Best regards,<br/>
//           <strong>Association of Bengal for Literature and Culture</strong><br/>
//           <span style="font-size: 11px; color: #999;">This is an automated notification. Please do not reply directly to this email.</span>
//         </p>

//       </div>
//     `,
//   };

//   await transporter.sendMail(mailOptions);
// }

// export async function sendAcceptanceEmail(
//   toEmail: string,
//   participantName: string,
//   amount: string | number,
//   remarks?: string
// ): Promise<void> {
//   const mailOptions = {
//     from: `"Association of Bengal for Literature and Culture" <${process.env.EMAIL_USER}>`,
//     to: toEmail,
//     subject: `Stall Booking Accepted: ${participantName} - International Kolkata Book Fair 2026`,
//     html: `
//       <div style="font-family: Arial, sans-serif; color: #1e1b18; padding: 24px; max-width: 600px; margin: auto; border: 1px solid #e0bfbf; border-radius: 12px; background-color: #fff8f5;">
        
//         <!-- Header Section -->
//         <div style="text-align: center; border-bottom: 2px solid #e0bfbf; padding-bottom: 15px; margin-bottom: 20px;">
//           <h2 style="color: #570013; margin: 0; font-size: 18px; text-transform: uppercase; font-family: 'Playfair_Display', serif;">
//             ASSOCIATION OF BENGAL FOR LITERATURE AND CULTURE
//           </h2>
//           <h3 style="color: #570013; margin: 5px 0 0 0; font-size: 16px; font-family: 'Playfair_Display', serif;">
//             International Kolkata Book Fair 2026
//           </h3>
//         </div>

//         <p style="font-size: 15px; line-height: 1.5;">Dear <strong>${participantName}</strong>,</p>
        
//         <p style="font-size: 15px; line-height: 1.5;">
//           We are delighted to inform you that your stall booking application has been reviewed and ACCEPTED by the administration team of the Association of Bengal for Literature and Culture.
//         </p>

//         <!-- Status Notice Box -->
//         <div style="background-color: #e6f4ea; border-left: 4px solid #137333; padding: 15px; border-radius: 6px; font-size: 14px; margin: 20px 0; color: #137333; font-weight: bold;">
//           Application Status: ACCEPTED
//         </div>

//         <!-- Payment Details Card -->
//         <div style="background-color: #ffffff; border: 1px solid #e0bfbf; padding: 16px; border-radius: 8px; margin: 20px 0;">
//           <h3 style="color: #570013; margin-top: 0; font-size: 16px; margin-bottom: 10px;">Payment Details</h3>
//           <p style="margin: 6px 0; font-size: 14px;"><strong>Total Payable Amount:</strong> ₹${amount}</p>
//         </div>

//         ${remarks ? `
//         <!-- Admin Remarks Box -->
//         <div style="background-color: #fffbeb; border: 1px solid #fde68a; padding: 16px; border-radius: 8px; margin: 20px 0; color: #78350f;">
//           <h3 style="color: #570013; margin-top: 0; font-size: 15px; margin-bottom: 6px;">Admin Remarks / Instructions:</h3>
//           <p style="margin: 0; font-size: 14px; line-height: 1.4;">${remarks}</p>
//         </div>
//         ` : ''}

//         <p style="font-size: 15px; line-height: 1.5;">
//           Congratulations! Your stall setup request has been approved. Further instructions regarding your exact stall allotment, layout positioning, and payment procedures will be shared with you shortly.
//         </p>

//         <!-- Footer -->
//         <p style="margin-top: 30px; font-size: 13px; color: #775a19; line-height: 1.4;">
//           Best regards,<br/>
//           <strong>Association of Bengal for Literature and Culture</strong><br/>
//           <span style="font-size: 11px; color: #999;">This is an automated notification. Please do not reply directly to this email.</span>
//         </p>

//       </div>
//     `,
//   };

//   await transporter.sendMail(mailOptions);
// }

// export async function sendRejectionEmail(
//   toEmail: string,
//   participantName: string,
//   remarks?: string
// ): Promise<void> {
//   const mailOptions = {
//     from: `"Association of Bengal for Literature and Culture" <${process.env.EMAIL_USER}>`,
//     to: toEmail,
//     subject: `Stall Booking Status Update: ${participantName} - International Kolkata Book Fair 2026`,
//     html: `
//       <div style="font-family: Arial, sans-serif; color: #1e1b18; padding: 24px; max-width: 600px; margin: auto; border: 1px solid #e0bfbf; border-radius: 12px; background-color: #fff8f5;">
        
//         <!-- Header Section -->
//         <div style="text-align: center; border-bottom: 2px solid #e0bfbf; padding-bottom: 15px; margin-bottom: 20px;">
//           <h2 style="color: #570013; margin: 0; font-size: 18px; text-transform: uppercase; font-family: 'Playfair_Display', serif;">
//             ASSOCIATION OF BENGAL FOR LITERATURE AND CULTURE
//           </h2>
//           <h3 style="color: #570013; margin: 5px 0 0 0; font-size: 16px; font-family: 'Playfair_Display', serif;">
//             International Kolkata Book Fair 2026
//           </h3>
//         </div>

//         <p style="font-size: 15px; line-height: 1.5;">Dear <strong>${participantName}</strong>,</p>
        
//         <p style="font-size: 15px; line-height: 1.5;">
//           Thank you for submitting your application for the International Kolkata Book Fair 2026.
//         </p>

//         <div style="background-color: #fce8e6; border-left: 4px solid #c5221f; padding: 15px; border-radius: 6px; font-size: 14px; margin: 20px 0; color: #c5221f; font-weight: bold;">
//           Application Status: REJECTED
//           ${remarks ? `<div style="margin-top: 8px; font-size: 13px; font-weight: normal; color: #c5221f;"><strong>Remarks:</strong> ${remarks}</div>` : ""}
//         </div>

//         <p style="font-size: 15px; line-height: 1.5;">
//           Regrettably, we are unable to approve your stall application at this time due to high demand, spatial limitations, or specific criteria constraints. We deeply appreciate your interest and participation effort.
//         </p>

//         <p style="margin-top: 30px; font-size: 13px; color: #775a19; line-height: 1.4;">
//           Best regards,<br/>
//           <strong>Association of Bengal for Literature and Culture</strong><br/>
//           <span style="font-size: 11px; color: #999;">This is an automated notification. Please do not reply directly to this email.</span>
//         </p>

//       </div>
//     `,
//   };

//   await transporter.sendMail(mailOptions);
// }


import { transporter } from "./transporter";

export async function sendConfirmationEmail(
  toEmail: string,
  participantName: string,
  spaceReq: string,
  date: string,
  place: string,
  fairTitle: string = "International Kolkata Book Fair 2026"
): Promise<void> {
  const mailOptions = {
    from: `"Association of Bengal for Literature and Culture" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Stall Booking Request Submitted - ${fairTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1e1b18; padding: 24px; max-width: 600px; margin: auto; border: 1px solid #e0bfbf; border-radius: 12px; background-color: #fff8f5;">
        
        <!-- Header Section -->
        <div style="text-align: center; border-bottom: 2px solid #e0bfbf; padding-bottom: 15px; margin-bottom: 20px;">
          <h2 style="color: #570013; margin: 0; font-size: 18px; text-transform: uppercase; font-family: 'Playfair_Display', serif;">
            ASSOCIATION OF BENGAL FOR LITERATURE AND CULTURE
          </h2>
          <h3 style="color: #775a19; margin: 5px 0 0 0; font-size: 15px;">
            ${fairTitle}
          </h3>
        </div>

        <h3 style="color: #570013; margin-top: 0; font-size: 18px;">
          Stall Booking Request Received Successfully
        </h3>

        <p style="font-size: 15px; line-height: 1.5;">Dear <strong>${participantName}</strong>,</p>
        
        <p style="font-size: 15px; line-height: 1.5;">
          Thank you for submitting your stall booking request for participation in <strong>${fairTitle}</strong> through the <strong>Association of Bengal for Literature and Culture</strong>. We have successfully registered your application form and uploaded documents.
        </p>

        <!-- Status Notice Box -->
        <div style="background-color: #fef3c7; border-left: 4px solid #d97706; padding: 15px; border-radius: 6px; font-size: 14px; margin: 20px 0; color: #92400e;">
          <strong>Current Status: Pending Admin Confirmation</strong><br/>
          Your booking request is currently under review by our administration team. You will receive a final confirmation update shortly.
        </div>

        <!-- Application Summary Card -->
        <div style="background-color: #ffffff; border: 1px solid #e0bfbf; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #570013; margin-top: 0; font-size: 16px; margin-bottom: 10px;">Booking Request Summary</h3>
          <p style="margin: 6px 0; font-size: 14px;"><strong>Fair/Event:</strong> ${fairTitle}</p>
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

export async function sendAcceptanceEmail(
  toEmail: string,
  participantName: string,
  amount: string | number,
  remarks?: string,
  fairTitle: string = "International Kolkata Book Fair 2026"
): Promise<void> {
  const mailOptions = {
    from: `"Association of Bengal for Literature and Culture" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Stall Booking Accepted: ${participantName} - ${fairTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1e1b18; padding: 24px; max-width: 600px; margin: auto; border: 1px solid #e0bfbf; border-radius: 12px; background-color: #fff8f5;">
        
        <!-- Header Section -->
        <div style="text-align: center; border-bottom: 2px solid #e0bfbf; padding-bottom: 15px; margin-bottom: 20px;">
          <h2 style="color: #570013; margin: 0; font-size: 18px; text-transform: uppercase; font-family: 'Playfair_Display', serif;">
            ASSOCIATION OF BENGAL FOR LITERATURE AND CULTURE
          </h2>
          <h3 style="color: #570013; margin: 5px 0 0 0; font-size: 16px; font-family: 'Playfair_Display', serif;">
            ${fairTitle}
          </h3>
        </div>

        <p style="font-size: 15px; line-height: 1.5;">Dear <strong>${participantName}</strong>,</p>
        
        <p style="font-size: 15px; line-height: 1.5;">
          We are delighted to inform you that your stall booking application for <strong>${fairTitle}</strong> has been reviewed and ACCEPTED by the administration team of the Association of Bengal for Literature and Culture.
        </p>

        <!-- Status Notice Box -->
        <div style="background-color: #e6f4ea; border-left: 4px solid #137333; padding: 15px; border-radius: 6px; font-size: 14px; margin: 20px 0; color: #137333; font-weight: bold;">
          Application Status: ACCEPTED (${fairTitle})
        </div>

        <!-- Payment Details Card -->
        <div style="background-color: #ffffff; border: 1px solid #e0bfbf; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #570013; margin-top: 0; font-size: 16px; margin-bottom: 10px;">Payment Details</h3>
          <p style="margin: 6px 0; font-size: 14px;"><strong>Total Payable Amount:</strong> ₹${amount}</p>
        </div>

        ${remarks ? `
        <!-- Admin Remarks Box -->
        <div style="background-color: #fffbeb; border: 1px solid #fde68a; padding: 16px; border-radius: 8px; margin: 20px 0; color: #78350f;">
          <h3 style="color: #570013; margin-top: 0; font-size: 15px; margin-bottom: 6px;">Admin Remarks / Instructions:</h3>
          <p style="margin: 0; font-size: 14px; line-height: 1.4;">${remarks}</p>
        </div>
        ` : ''}

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
  remarks?: string,
  fairTitle: string = "International Kolkata Book Fair 2026"
): Promise<void> {
  const mailOptions = {
    from: `"Association of Bengal for Literature and Culture" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Stall Booking Status Update: ${participantName} - ${fairTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1e1b18; padding: 24px; max-width: 600px; margin: auto; border: 1px solid #e0bfbf; border-radius: 12px; background-color: #fff8f5;">
        
        <!-- Header Section -->
        <div style="text-align: center; border-bottom: 2px solid #e0bfbf; padding-bottom: 15px; margin-bottom: 20px;">
          <h2 style="color: #570013; margin: 0; font-size: 18px; text-transform: uppercase; font-family: 'Playfair_Display', serif;">
            ASSOCIATION OF BENGAL FOR LITERATURE AND CULTURE
          </h2>
          <h3 style="color: #570013; margin: 5px 0 0 0; font-size: 16px; font-family: 'Playfair_Display', serif;">
            ${fairTitle}
          </h3>
        </div>

        <p style="font-size: 15px; line-height: 1.5;">Dear <strong>${participantName}</strong>,</p>
        
        <p style="font-size: 15px; line-height: 1.5;">
          Thank you for submitting your application for <strong>${fairTitle}</strong>.
        </p>

        <div style="background-color: #fce8e6; border-left: 4px solid #c5221f; padding: 15px; border-radius: 6px; font-size: 14px; margin: 20px 0; color: #c5221f; font-weight: bold;">
          Application Status: REJECTED (${fairTitle})
          ${remarks ? `<div style="margin-top: 8px; font-size: 13px; font-weight: normal; color: #c5221f;"><strong>Remarks:</strong> ${remarks}</div>` : ""}
        </div>

        <p style="font-size: 15px; line-height: 1.5;">
          Regrettably, we are unable to approve your stall application at this time due to high demand, spatial limitations, or specific criteria constraints. We deeply appreciate your interest and participation effort.
        </p>

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