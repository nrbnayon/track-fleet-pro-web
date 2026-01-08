// src\app\(auth)\components\ForgetPassword.tsx
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { Mail, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { emailValidationSchema } from "@/lib/formDataValidation";

type ForgetPasswordFormData = z.infer<typeof emailValidationSchema>;

export default function ForgetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgetPasswordFormData>({
    resolver: zodResolver(emailValidationSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgetPasswordFormData) => {
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Log the form data to console
      console.log("Forget Password Form Data:", {
        email: data.email,
        timestamp: new Date().toISOString(),
      });

      // Simulate successful OTP send
      toast.success("OTP sent successfully!", {
        description: `Verification code sent to ${data.email}`,
        duration: 2000,
      });

      // Store email in localStorage for OTP verification
      localStorage.setItem("resetEmail", data.email);
      localStorage.setItem("otpSentTime", Date.now().toString());

      // Redirect to OTP verification after a short delay
      setTimeout(() => {
        router.push("/verify-otp");
      }, 1000);
    } catch (error) {
      console.error("Forget password error:", error);
      toast.error("Failed to send OTP", {
        description: "Please check your email and try again.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white w-full min-h-screen flex flex-col lg:flex-row">
      <aside className="hidden lg:flex w-full lg:w-[45%] xl:w-1/2 h-full lg:min-h-screen relative flex-col items-center justify-center gap-8 lg:gap-16 bg-[#DDEFFC] lg:rounded-[0px_16px_16px_0px] overflow-hidden px-6 py-12">
        <div className="relative w-16 h-16 lg:w-150 lg:h-150">
          <img
            className="absolute top-0 left-0 w-16 h-16 lg:w-150 lg:h-150"
            alt="Logo icon"
            src="/icons/forgot-pass.svg"
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
              Forget Password?
            </h1>
            <h2 className="text-base text-secondary mb-5 lg:mb-10 px-5 mx-auto">
              Enter the email used for your account and we’ll send  you a code for the confirmation.
            </h2>
          </div>

          <CardContent className="px-2 sm:px-4 lg:px-6">
            <form
              className="space-y-4 sm:space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-foreground text-sm sm:text-base font-medium block"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className={`pl-4 pr-10 h-10 sm:h-12 rounded-md shadow-none text-foreground placeholder:text-muted-foreground text-sm sm:text-base ${errors.email
                      ? "border-error focus:border-error"
                      : "input-focus"
                      }`}
                    {...register("email")}
                    disabled={isLoading}
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                </div>
                {errors.email && (
                  <p className="text-error text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Send OTP Button */}
              <div className="w-full flex justify-center items-center my-5">
                <Button
                  type="submit"
                  className="w-1/2 h-10 bg-primary hover:bg-primary-hover text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-indigo-500/20 mt-5"
                  disabled={isLoading || isSubmitting}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span className="hidden sm:inline">Sending OTP...</span>
                      <span className="sm:hidden">Sending...</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">
                        Reset Password
                      </span>
                      <span className="sm:hidden">Send Code</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </div>
      </div>
    </div>
  );
}
