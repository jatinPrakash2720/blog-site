"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/store/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema } from "@/schemas/otpSchema";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export const OTPVerificationPage = () => {
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const location = useLocation();
  const { verifyUser, resendVerifyCode } = useAuth();

  // Get email from location state
  const userEmail = location.state?.email|| "user@example.com";
  const saveLogin = location.state?.saveLogin || false;

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (values: z.infer<typeof otpSchema>) => {
    setIsVerifying(true);

    try {
      const response = await verifyUser({
        email: userEmail,
        code: values.otp,
        saveLogin: saveLogin,
      });
      if (!response?.success) {
        toast.error(response?.message);
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      form.setError("otp", {
        message:
          error.response?.data?.message ||
          "Verification failed. Please try again.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    setCountdown(60); // 60 second cooldown

    try {
      const response = await resendVerifyCode(userEmail);
      if (!response?.success) {
        toast.error(response?.message);
      }
      toast.success(response?.message);
    } catch (error) {
      console.error("Resend code error:", error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row font-sans w-screen flex-1 items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-lg py-8 px-10  bg-white dark:bg-zinc-950  border dark:border-zinc-800/60 border-zinc-200/60 rounded-[32px] shadow-2xl transform transition-all duration-300 hover:shadow-3xl">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-foreground dark:text-muted-foreground">Verify Your Email
          </h1>

          <p className=" lg:py-2 py-1 text-foreground dark:text-muted-foreground text-sm md:text-base lg:text-lg">
            We've sent a verification code to your email address
          </p>

          <p className=" text-sm font-medium text-foreground/80">
            Sent to <span className="font-medium">{userEmail}</span>
          </p>
          <Separator />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleVerify)}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm md:text-base lg:text-lg font-medium text-foreground dark:text-muted-foreground mb-2 block text-start">
                      Enter 6-digit verification code
                    </FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field} disabled={isVerifying}>
                        <InputOTPGroup className="flex w-full gap-2">
                          {Array.from({ length: 6 }).map((_, index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className="h-12 md:h-13 lg:h-14 flex-1 text-lg border-2 rounded-xl "
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    {/* <FormMessage className="text-center" /> */}
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isVerifying}
                className=" w-full rounded-2xl p-3 text-base font-medium h-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="animate-spin" /> Please wait
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>
            </form>
          </Form>

          <div className=" flex items-center justify-end text-center mt-2">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?{" "}
              <button
                onClick={handleResend}
                disabled={countdown > 0 || isResending}
                className="text-blue-500 hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
              </button>
            </p>
          </div>

          <p className=" text-end text-xs text-muted-foreground">
            Check your spam folder if you don't see the email
          </p>
        </div>
      </div>
    </div>
  );
};
