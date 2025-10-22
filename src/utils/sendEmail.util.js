import { Resend } from "resend";
import VerificationEmail from "../../emails/verificationEmail.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email, username, verifyCode) {
  console.log(email, username, verifyCode);
  try {
    const result = await resend.emails.send({
      from: "noreply-bloglikho@jatinbuilds.com",
      to: email,
      subject: "BlogLikho| SignUp Verification code",
      html: VerificationEmail({ username, otp: verifyCode }),
    });
    console.log(result);
    if (!result.data?.id) {
      return {
        success: false,
        message: "Failed to send email- wrong email id",
      };
    }

    try {
      const emailStatus = await resend.emails.get(result.data.id);
      if (emailStatus.data?.last_event) {
        const lastEvent = emailStatus.data.last_event;

        if (["bounced", "failed", "complained"].includes(lastEvent)) {
          return {
            success: false,
            message: `Email Status : ${lastEvent}`,
          };
        }

        if (["delivered", "sent", "opened", "clicked"].includes(lastEvent)) {
          return {
            success: true,
            message: "Confirmation Email sent successfully.",
          };
        }

        if (["queued", "scheduled", "delivery_delayed"].includes(lastEvent)) {
          return {
            success: true,
            message: `Confirmation email ${lastEvent} for delivery`,
          };
        }

        return {
          success: true,
          message: "Confirmation Email sent Successfully !",
        };
      }
    } catch {
      return {
        success: true,
        message: "Admin notification email sent successfully!",
      };
    }
    return {
      success: true,
      message: "Verification email is send successfully !",
    };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
