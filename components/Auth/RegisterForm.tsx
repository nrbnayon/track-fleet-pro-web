// src\app\(auth)\components\RegisterForm.tsx
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signupValidationSchema } from "@/lib/formDataValidation";
import Link from "next/link";

type RegisterFormData = z.infer<typeof signupValidationSchema>;

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(signupValidationSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Log the form data to console
      console.log("Registration Form Data:", {
        full_name: data.full_name,
        email: data.email,
        password: data.password,
        agreeToTerms: data.agreeToTerms,
        timestamp: new Date().toISOString(),
      });

      // Simulate successful registration
      toast.success("Registration successful!", {
        description: `Welcome, ${data.full_name}! Your account has been created.`,
        duration: 2000,
      });

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed", {
        description: "Something went wrong. Please try again.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col-reverse lg:flex-row bg-background">
      {/* Right Side - Register Form */}
      <div className="flex-1 bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8 order-1 lg:order-2">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-xl p-4 sm:p-8 rounded-md sm:rounded-lg lg:rounded-2xl border-none shadow-none bg-white dark:bg-gray-800">
          <div className="w-full flex justify-center items-center">
            <Image
              src="/icons/logo.png"
              alt="logo"
              width={120}
              height={120}
              className="w-[100px] h-[100px] md:w-[140px] md:h-[140px]"
            />
          </div>
          <CardHeader className="text-center">
            <h2 className="text-lg sm:text-2xl text-primary dark:text-white">
              Sign Up
            </h2>
          </CardHeader>
          <CardHeader className="text-center mb-2">
            <h2 className="text-base text-secondary">
              Enter your email and password to access your account.
            </h2>
          </CardHeader>

          <div className="px-2 sm:px-4 lg:px-6">
            <form
              className="space-y-4 sm:space-y-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="full_name"
                  className="text-foreground text-sm sm:text-base font-semibold block"
                >
                  Name <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="full_name"
                    type="text"
                    placeholder="jonansmth45@company.com"
                    className={`pl-4 pr-10 h-10 sm:h-12 rounded-md shadow-none text-foreground placeholder:text-muted-foreground text-sm sm:text-base ${
                      errors.full_name
                        ? "border-destructive focus:border-destructive"
                        : "input-focus"
                    }`}
                    {...register("full_name")}
                    disabled={isLoading}
                  />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                </div>
                {errors.full_name && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-foreground text-sm sm:text-base font-semibold block"
                >
                  Email <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="text"
                    placeholder="jonansmth45@company.com"
                    className={`pl-4 pr-10 h-10 sm:h-12 rounded-md shadow-none text-foreground placeholder:text-muted-foreground text-sm sm:text-base ${
                      errors.email
                        ? "border-destructive focus:border-destructive"
                        : "input-focus"
                    }`}
                    {...register("email")}
                    disabled={isLoading}
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                </div>
                {errors.email && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-foreground text-sm sm:text-base font-semibold block"
                >
                  Password <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="***************"
                    className={`pl-4 pr-10 h-10 sm:h-12 rounded-md shadow-none text-foreground placeholder:text-muted-foreground text-sm sm:text-base ${
                      errors.password
                        ? "border-destructive focus:border-destructive"
                        : "input-focus"
                    }`}
                    {...register("password")}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-primary transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-foreground text-sm sm:text-base font-semibold block"
                >
                  Rewrite Password <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="***************"
                    className={`pl-4 pr-10 h-10 sm:h-12 rounded-md shadow-none text-foreground placeholder:text-muted-foreground text-sm sm:text-base ${
                      errors.confirmPassword
                        ? "border-destructive focus:border-destructive"
                        : "input-focus"
                    }`}
                    {...register("confirmPassword")}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-primary transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                  {...register("agreeToTerms")}
                  disabled={isLoading}
                />
                <label
                  htmlFor="agreeToTerms"
                  className="text-sm text-muted-foreground"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-primary font-semibold hover:underline"
                  >
                    Terms and Conditions
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-destructive text-xs mt-1">
                  {errors.agreeToTerms.message}
                </p>
              )}

              {/* Sign Up Button */}
              <Button
                type="submit"
                className="w-full h-10 sm:h-12 bg-primary hover:bg-primary/90 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
                disabled={isLoading || isSubmitting}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Sign up"
                )}
              </Button>
            </form>
          </div>
          <div className="w-full flex justify-center items-center mt-4">
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-semibold hover:underline transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}