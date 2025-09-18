// 1. Import all the InputOTP components from the raw Shadcn UI file
import {
  InputOTP as ShadcnInputOTP,
  InputOTPGroup as ShadcnInputOTPGroup,
  InputOTPSlot as ShadcnInputOTPSlot,
  InputOTPSeparator as ShadcnInputOTPSeparator,
} from "@/components/ui/input-otp";

// 2. Re-export all the components for use in your application.
const InputOTP = ShadcnInputOTP;
const InputOTPGroup = ShadcnInputOTPGroup;
const InputOTPSlot = ShadcnInputOTPSlot;
const InputOTPSeparator = ShadcnInputOTPSeparator;

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
