import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_PORT === "465",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { full_name, phone_number, email_address, subject, message } = body;

    // 1. Validate inputs
    if (!full_name || !email_address || !subject || !message) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 2. Save to MongoDB
    await connectDB();
    await Contact.create({
      full_name,
      phone_number,
      email_address,
      subject,
      message,
    });

    // 3. Setup professional email template
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      replyTo: email_address,
      subject: `New Form Enquiry: ${subject}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0bfbf; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <div style="background-color: #570013; padding: 25px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; font-weight: 600;">New Enquiry Received</h2>
            <p style="color: #fed488; margin: 8px 0 0 0; font-size: 14px;">Association of Bengal for Literature and Culture</p>
          </div>
          
          <!-- Body -->
          <div style="padding: 30px; background-color: #ffffff;">
            <p style="color: #584141; font-size: 16px; margin-top: 0; margin-bottom: 25px;">You have received a new contact form submission. Here are the details:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #fbf2ed; color: #775a19; font-weight: 600; width: 130px;">Name</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #fbf2ed; color: #1e1b18;">${full_name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #fbf2ed; color: #775a19; font-weight: 600;">Email</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #fbf2ed; color: #1e1b18;"><a href="mailto:${email_address}" style="color: #570013; text-decoration: none;">${email_address}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #fbf2ed; color: #775a19; font-weight: 600;">Phone</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #fbf2ed; color: #1e1b18;">${phone_number || "<em>Not provided</em>"}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #fbf2ed; color: #775a19; font-weight: 600;">Subject</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #fbf2ed; color: #1e1b18; font-weight: 500;">${subject}</td>
              </tr>
            </table>
            
            <!-- Message Box -->
            <div style="background-color: #fbf2ed; border-left: 4px solid #775a19; padding: 20px; border-radius: 4px;">
              <p style="margin: 0 0 10px 0; color: #775a19; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Message Content</p>
              <p style="margin: 0; color: #1e1b18; white-space: pre-wrap; line-height: 1.6; font-size: 15px;">${message}</p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #fff8f5; padding: 20px; text-align: center; border-top: 1px solid #e0bfbf;">
            <p style="margin: 0; color: #8c7071; font-size: 12px;">This email was automatically generated from your website's contact form.</p>
          </div>
          
        </div>
      `,
    };

    // 4. Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Data saved and email sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API Error Detail:", error);
    return NextResponse.json(
      {
        message: "Failed to process request",
        error: error.message || "Unknown server error",
      },
      { status: 500 }
    );
  }
}