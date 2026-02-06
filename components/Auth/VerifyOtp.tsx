// src\app\(auth)\components\VerifyOtp.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  useVerifyEmailMutation, 
  useVerifyResetCodeMutation, 
  useResendOtpMutation 
} from "@/redux/services/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setCredentials } from "@/redux/features/authSlice";
import { setCookie } from "@/redux/services/apiSlice";

// Validation schema
const otpSchema = z.object({
  otp: z
    .string()
    .min(4, "OTP must be 4 digits")
    .max(4, "OTP must be 4 digits")
    .regex(/^\d{4}$/, "OTP must contain only numbers"),
});

type OtpFormData = z.infer<typeof otpSchema>;

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // API Hooks
  const [verifyEmail, { isLoading: isVerifyEmailLoading }] = useVerifyEmailMutation();
  const [verifyResetCode, { isLoading: isVerifyResetLoading }] = useVerifyResetCodeMutation();
  const [resendOtp, { isLoading: isResendLoading }] = useResendOtpMutation();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    setError,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  // Initialize timer and email on component mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("signupEmail") || localStorage.getItem("resetEmail");
    const otpSentTime = localStorage.getItem("otpSentTime");
    const timerKey = `otpTimer_${storedEmail}`;
    const storedTimeLeft = localStorage.getItem(timerKey);

    if (!storedEmail) {
      toast.error("Session expired", {
        description: "Please start the signup process again.",
      });
      router.push("/signup");
      return;
    }

    setEmail(storedEmail);

    // Calculate remaining time
    if (otpSentTime && storedTimeLeft) {
      const timePassed = Math.floor(
        (Date.now() - parseInt(otpSentTime)) / 1000
      );
      const remainingTime = Math.max(0, parseInt(storedTimeLeft) - timePassed);
      setTimeLeft(remainingTime);
    } else if (otpSentTime) {
      const timePassed = Math.floor(
        (Date.now() - parseInt(otpSentTime)) / 1000
      );
      const remainingTime = Math.max(0, 180 - timePassed);
      setTimeLeft(remainingTime);
      localStorage.setItem(timerKey, remainingTime.toString());
    }
  }, [router]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          // Save timer state to localStorage
          const timerKey = `otpTimer_${email}`;
          localStorage.setItem(timerKey, newTime.toString());
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timeLeft, email]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const onSubmit = async (data: OtpFormData) => {
    setIsLoading(true);

    try {
      const isSignupFlow = localStorage.getItem("signupEmail");
      const userId = localStorage.getItem("userId");
      
      if (!userId) {
         toast.error("Session expired. Please try again.");
         router.push(isSignupFlow ? "/signup" : "/forgot-password");
         return;
      }

      if (isSignupFlow) {
        // Handle Email Verification (Signup Flow)
        const response = await verifyEmail({
          user_id: userId,
          code: data.otp
        }).unwrap();

        if (response.success && response.data) {
          const { access_token, refresh_token, user_id, role } = response.data;
          
          // Store tokens and auth state
          setCookie("accessToken", access_token, 7);
          setCookie("refreshToken", refresh_token, 7);
          setCookie("userRole", role, 7);
          setCookie("userId", user_id, 7);
          
          dispatch(setCredentials({
              user: {
                  user_id,
                  email_address: email,
                  role,
              },
              token: access_token,
              refreshToken: refresh_token
          }));

          toast.success("Email verified successfully!", {
            description: "Logging you in...",
            duration: 2000,
          });

          // Cleanup localStorage
          localStorage.removeItem("signupEmail");
          localStorage.removeItem("otpTimer_" + email);
          localStorage.removeItem("otpSentTime");
           // Keep userId if needed or can rely on cookie? 
           // For dashboard, we rely on cookies/redux. 
           // Better to clear temp storage.
           localStorage.removeItem("userId");

          // Redirect to dashboard
          setTimeout(() => {
             // Simple role based redirect or default
             if (role === 'SUPER_ADMIN') router.push('/super-admin/dashboard');
             else if (role === 'SELLER') router.push('/seller-admin/dashboard');
             else router.push('/track-parcel'); 
          }, 1000);
        }
      } else {
        // Handle Reset Code Verification (Forgot Password Flow)
        const response = await verifyResetCode({
            user_id: userId,
            code: data.otp
        }).unwrap();

        if (response.success && response.data) {
           const { secret_key } = response.data;
           
           // Store secret key for password reset step
           localStorage.setItem("resetSecretKey", secret_key);
           localStorage.setItem("otpVerified", "true");
           localStorage.setItem("verificationTime", Date.now().toString());

           toast.success("Code verified successfully!", {
              description: "Please set your new password.",
              duration: 2000,
           });
           
           // Cleanup timer
           localStorage.removeItem("otpTimer_" + email);

           setTimeout(() => {
               router.push("/reset-password");
           }, 1000);
        }
      }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("OTP verification error:", error);
      const errorMessage = error?.data?.message || "Invalid OTP or expired.";
      toast.error("Verification failed", {
        description: errorMessage,
        duration: 3000,
      });
      setError("otp", { message: "Invalid OTP code" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);

    try {
      const response = await resendOtp({
         email_address: email
      }).unwrap();

      if (response.success) {
         // Reset timer
        setTimeLeft(180);
        const newSentTime = Date.now();
        localStorage.setItem("otpSentTime", newSentTime.toString());
        const timerKey = `otpTimer_${email}`;
        localStorage.setItem(timerKey, "180");
        
        toast.success("OTP resent successfully!", {
            description: `New verification code sent to ${email}`,
            duration: 2000,
        });
      }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      toast.error("Failed to resend OTP", {
        description: error?.data?.message || "Please try again later.",
        duration: 3000,
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setValue("otp", value);

    // Auto-submit when OTP is complete
    if (value.length === 6) {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="bg-white w-full min-h-screen flex flex-col lg:flex-row">
      <aside className="hidden lg:flex w-full lg:w-[45%] xl:w-1/2 h-full lg:min-h-screen relative flex-col items-center justify-center gap-8 lg:gap-16 bg-[#DDEFFC] lg:rounded-[0px_16px_16px_0px] overflow-hidden px-6 py-12">
        <div className="relative w-16 h-16 lg:w-195 lg:h-150">
          <img
            className="absolute top-0 left-0 w-16 h-16 lg:w-195 lg:h-150"
            alt="Logo icon"
            src="/icons/otp-verify.svg"
          />
        </div>
        <div className="top-[-200px] lg:top-[-373px] left-[-150px] lg:left-[-257px] absolute w-[600px] lg:w-[850px] h-[350px] lg:h-[496px] bg-[#1d92ed99] rounded-[300px/175px] lg:rounded-[425px/248px] blur-[100px]" />
        <div className="bottom-[-200px] lg:bottom-[-92px] right-[-150px] lg:right-[-267px] absolute w-[200px] lg:w-[850px] h-[100px] lg:h-[150px] bg-[#1d92ed99] rounded-[300px/175px] lg:rounded-[425px/248px] blur-[100px]" />
      </aside>

      {/* ------------- Right side ------------- */}
      <div className="flex w-full lg:w-1/2 min-h-screen relative flex-col items-center justify-center gap-8 lg:gap-12 px-6 py-12 lg:px-8 xl:px-12">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-xl p-4 py-6 rounded-sm sm:rounded-xl border-none shadow-none bg-white">
          <div className="text-center relative mb-2">
            <div className="flex items-center justify-center mb-2 sm:mb-10">
              <div className="w-full flex justify-center items-center">
                <Image
                  src="/icons/logo.svg"
                  alt="logo"
                  width={200}
                  height={150}
                />
              </div>
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold text-primary mb-2 lg:mb-6">
              Enter OTP
            </h1>
            <h2 className="text-base text-secondary mb-5 lg:mb-10 px-5 mx-auto">
              {`We sent a 4 code to your email ${email}`}
            </h2>
          </div>

          <CardContent className="px-2 sm:px-4 lg:px-6">
            <form
              className="space-y-4 sm:space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* OTP Input */}
              <div className="space-y-2">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={4}
                    value={otp}
                    onChange={handleOtpChange}
                    disabled={isLoading || timeLeft === 0}
                  >
                    <InputOTPGroup className="gap-2 sm:gap-6">
                      <InputOTPSlot
                        index={0}
                        className="w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg rounded-md shadow-none text-foreground"
                      />
                      <InputOTPSlot
                        index={1}
                        className="w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg rounded-md shadow-none text-foreground"
                      />
                      <InputOTPSlot
                        index={2}
                        className="w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg rounded-md shadow-none text-foreground"
                      />
                      <InputOTPSlot
                        index={3}
                        className="w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg rounded-md shadow-none text-foreground"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {errors.otp && (
                  <p className="text-error text-xs mt-1 text-center">
                    {errors.otp.message}
                  </p>
                )}
              </div>

              {/* Timer Display */}
              <div className="text-center">
                {timeLeft > 0 ? (
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Code expires in:{" "}
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                      {formatTime(timeLeft)}s
                    </span>
                  </p>
                ) : (
                  <p className="text-error text-xs sm:text-sm">
                    Verification code has expired
                  </p>
                )}
              </div>

              {/* Verify Button */}
              <div className="w-full flex justify-center items-center">
                <Button
                  type="submit"
                  className="w-1/2 h-10 bg-primary hover:bg-primary-hover text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-indigo-500/20"
                  disabled={
                    isLoading ||
                    isSubmitting ||
                    otp.length !== 4 ||
                    timeLeft === 0
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span className="hidden sm:inline">Verifying...</span>
                      <span className="sm:hidden">Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Verify Code</span>
                      <span className="sm:hidden">Verify</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Resend Button */}
              <div className="flex items-center justify-center gap-2">
                <p className="text-secondary text-xs sm:text-sm text-center">
                  Didn&lsquo;t receive the code?
                </p>
                <button
                  onClick={handleResendOtp}
                  className="text-red text-xs sm:text-sm hover:text-red hover:underline transition-colors text-center sm:text-right cursor-pointer"
                >
                  {isResending ? (
                    <>
                      <p className="flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span className="hidden sm:inline text-primary">Resending...</span>
                        <span className="sm:hidden text-primary">Resending...</span></p>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline text-primary">Resend Code</span>
                      <span className="sm:hidden text-primary">Resend</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </CardContent>
        </div>
      </div>
    </div>
  );
}
