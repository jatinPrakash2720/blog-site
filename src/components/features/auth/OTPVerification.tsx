"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import type { OTPVerificationPageProps } from "@/types/components/features/auth";
import { OTPInput } from "@/components/common/subComps/OTPInputs";
import {Button} from "@/components/common/wrappers/Button";
import { useTheme } from "@/store/theme";

export const OTPVerificationPage: React.FC<OTPVerificationPageProps> = ({
  title = (
    <span className="font-light text-foreground tracking-tighter">
      Verify Your Email
    </span>
  ),
  description = "We've sent a verification code to your email address",
  email = "user@example.com",
  onVerifyOTP,
  onResendCode,
  codeLength = 6,
}) => {
  const [otp, setOtp] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const theme = useTheme();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOTPComplete = (otpValue: string) => {
    setOtp(otpValue);
  };

  const handleVerify = () => {
    if (otp.length === codeLength) {
      onVerifyOTP?.(otp);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    setCountdown(60); // 60 second cooldown

    try {
      await onResendCode?.();
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="h-[100vh] flex flex-col md:flex-row font-sans w-[100vw] flex-1 items-center justify-center p-4 overflow-hidden ">
      {/* Left column: OTP verification form */}
      <div className="w-full max-w-md hover:shadow-3xl px-8 py-4 bg-white/50 dark:bg-black/40 backdrop-blur-xl border dark:border-white/10 border-black/10 rounded-[32px] shadow-2xl transform transition-all duration-300 hover:shadow-3xl">
        <div className="flex flex-col items-start gap-6">
        

          <h1 className=" text-4xl md:text-5xl font-semibold leading-tight text-center w-full">
            {title}
          </h1>

          <div className=" w-full flex flex-col items-center">
            <p className="text-muted-foreground text-center ">{description}</p>
            <p className="text-sm text-foreground/80 mt-1 text-center">
              Sent to <span className="font-medium">{email}</span>
            </p>
          </div>

          <div className="w-full space-y-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-4 text-center">
                Enter {codeLength}-digit verification code
              </label>
              <OTPInput length={codeLength} onComplete={handleOTPComplete} />
            </div>

            <Button
              intent={theme.theme === "dark" ? "authd" : "authl"}
              size="auth"
              onClick={handleVerify}
              disabled={otp.length !== codeLength}
              className="animate-element animate-delay-500"
            >
              Verify Code
            </Button>
          </div>

          <div className="text-center w-full">
            <p className="text-sm text-muted-foreground mb-3">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={countdown > 0 || isResending}
              className="flex items-center gap-2 text-sky-600 hover:text-sky-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
            >
              <RefreshCw
                className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`}
              />
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
            </button>
          </div>

          <div className=" w-full text-center text-xs text-muted-foreground">
            <p>Check your spam folder if you don't see the email</p>
          </div>
        </div>
      </div>
    </div>
  );
};
