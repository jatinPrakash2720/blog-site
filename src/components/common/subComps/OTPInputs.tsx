import { useState, useRef, useEffect } from "react";
import { GlassInputWrapper } from "./GlassInputWrapper";
import type React from "react";

export const OTPInput = ({
  length = 6,
  onComplete,
}: {
  length?: number;
  onComplete: (otp: string) => void;
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.value !== "" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      setOtp([...otp.map((d, idx) => (idx === index ? "" : d))]);
    }
  };

  // ... (handlePaste logic can be added here if needed)

  useEffect(() => {
    const otpString = otp.join("");
    if (otpString.length === length) {
      onComplete(otpString);
    }
  }, [otp, length, onComplete]);

  return (
    <div className="flex gap-3 justify-center">
      {otp.map((data, index) => (
        <GlassInputWrapper key={index}>
          <input
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            maxLength={1}
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-14 h-14 text-center text-xl font-semibold bg-transparent rounded-2xl focus:outline-none"
          />
        </GlassInputWrapper>
      ))}
    </div>
  );
};
