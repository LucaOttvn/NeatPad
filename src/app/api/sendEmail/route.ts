import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
    try {
        const requestJSON = await request.json();

        const resend = new Resend(process.env.EMAIL_API_KEY);
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: requestJSON.email,
            subject: 'Reset your password',
            html: `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Password Reset</title>
        <style>
          body { font-family: sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
          h1 { color: #2c3e50; }
          a { display: inline-block; background-color: #007bff; color: white !important; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
          a:hover { background-color: #0056b3; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Reset Your Password</h1>
          <p>You recently requested to reset your password for your account.</p>
          <p>Please click the button below to reset your password:</p>
          <a href="${requestJSON.resetLink}" target="_blank" rel="noopener noreferrer">Reset Password</a>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>Thanks,<br>Your Team</p>
        </div>
      </body>
      </html>
    `
        });


        return NextResponse.json({ message: 'Password updated successfully.' }, { status: 200 });
    } catch (error: any) {
        console.error('Error changing password via API:', error);
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}