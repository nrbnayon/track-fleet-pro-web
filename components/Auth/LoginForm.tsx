// src\app\(auth)\components\LoginForm.tsx
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, EyeOffIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginValidationSchema } from "@/lib/formDataValidation";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

type LoginFormData = z.infer<typeof loginValidationSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginValidationSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Development dummy credentials check with role assignment
      const isDummyLogin =
        (data.email === "admin@gmail.com" && data.password === "admin") ||
        (data.email === "manager@gmail.com" && data.password === "manager") ||
        (data.email === "user@gmail.com" && data.password === "user");

      if (isDummyLogin) {
        // Set development cookies for dummy login
        const expires = new Date();
        expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
        const expiresString = expires.toUTCString();

        // Determine user role based on email
        let userRole = "user";
        if (data.email === "admin@gmail.com") {
          userRole = "admin";
        } else if (data.email === "manager@gmail.com") {
          userRole = "manager";
        } else if (data.email === "user@gmail.com") {
          userRole = "user";
        }

        // Set cookies
        document.cookie = `accessToken=dev-${userRole}-token; expires=${expiresString}; path=/; SameSite=Lax`;
        document.cookie = `refreshToken=dev-refresh-token; expires=${expiresString}; path=/; SameSite=Lax`;
        document.cookie = `userRole=${userRole}; expires=${expiresString}; path=/; SameSite=Lax`;
        document.cookie = `userEmail=${encodeURIComponent(data.email)}; expires=${expiresString}; path=/; SameSite=Lax`;

        toast.success("Login successful!", {
          description: `Welcome back, ${data.email}!`,
          duration: 2000,
        });

        // Redirect based on user role
        setTimeout(() => {
          if (userRole === "admin") {
            router.push("/admin/dashboard");
          } else if (userRole === "manager") {
            router.push("/manager/dashboard");
          } else {
            router.push("/user/dashboard");
          }
        }, 1000);
      } else {
        // Log the form data to console
        console.log("Login Form Data:", {
          email: data.email,
          password: data.password,
          rememberMe: data.rememberMe,
          timestamp: new Date().toISOString(),
        });

        // Simulate successful login for other credentials (default to user role)
        const expires = new Date();
        expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
        const expiresString = expires.toUTCString();

        // Set cookies with user role as default
        document.cookie = `accessToken=dev-user-token; expires=${expiresString}; path=/; SameSite=Lax`;
        document.cookie = `refreshToken=dev-refresh-token; expires=${expiresString}; path=/; SameSite=Lax`;
        document.cookie = `userRole=user; expires=${expiresString}; path=/; SameSite=Lax`;
        document.cookie = `userEmail=${encodeURIComponent(data.email)}; expires=${expiresString}; path=/; SameSite=Lax`;

        toast.success("Login successful!", {
          description: `Welcome back, ${data.email}!`,
          duration: 2000,
        });

        // Redirect to user dashboard
        setTimeout(() => {
          router.push("/user/dashboard");
        }, 1000);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed", {
        description: "Please check your credentials and try again.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white w-full min-h-screen flex flex-col lg:flex-row">
      <aside className="hidden lg:flex w-full lg:w-[45%] xl:w-1/2 h-full lg:min-h-screen relative flex-col items-center justify-center gap-8 lg:gap-16 bg-[#DDEFFC] lg:rounded-[0px_16px_16px_0px] overflow-hidden px-6 py-12">
        <div className="flex flex-col w-35 lg:w-45 items-center gap-2 lg:gap-3 relative z-10">
          <div className="relative w-16 h-16 lg:w-45 lg:h-35">
            <img
              className="absolute top-0 left-0 w-16 h-16 lg:w-45 lg:h-35"
              alt="Logo icon"
              src="/icons/login.svg"
            />
          </div>
        </div>

        <div className="flex flex-col w-full max-w-3xl lg:max-w-4xl items-center gap-4 lg:gap-6 relative z-10 px-4">
          <h1 className="relative font-bold text-foreground text-3xl lg:text-5xl text-center tracking-[0] leading-[36px] lg:leading-[57.6px]">
            Don&apos;t Have an Account Yet?
          </h1>
          <p className="relative font-medium text-secondary text-lg lg:text-2xl text-center max-w-xl">
            Let&apos;s get you all set up so you can start creating your first
            onboarding experience.
          </p>
        </div>

        <Link href='signup' className="flex w-65 items-center justify-center py-2.5 text-white bg-primary rounded-full">
          Sign Up
        </Link>

        <div className="top-[-200px] lg:top-[-373px] left-[-150px] lg:left-[-257px] absolute w-[600px] lg:w-[850px] h-[350px] lg:h-[496px] bg-[#1d92ed99] rounded-[300px/175px] lg:rounded-[425px/248px] blur-[100px]" />
        <div className="bottom-[-200px] lg:bottom-[-92px] right-[-150px] lg:right-[-267px] absolute w-[200px] lg:w-[850px] h-[100px] lg:h-[150px] bg-[#1d92ed99] rounded-[300px/175px] lg:rounded-[425px/248px] blur-[100px]" />
      </aside>

      {/* ------------- Right side ------------- */}
      <div className="flex w-full lg:w-1/2 min-h-screen relative flex-col items-center justify-center gap-8 lg:gap-12 px-6 py-12 lg:px-8 xl:px-12">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-xl p-4 sm:p-8  rounded-md sm:rounded-lg lg:rounded-2xl border-none shadow-none bg-white">
          <CardHeader className="text-center">
            <h1 className="text-3xl lg:text-5xl font-bold text-primary mb-6">
              Log In
            </h1>
          </CardHeader>
          <CardHeader className="text-center mb-10">
            <h2 className="text-base text-foreground">
              Log in with Email & Password
            </h2>
          </CardHeader>

          <div className="px-2 sm:px-4 lg:px-6">
            <form
              className="space-y-4 sm:space-y-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-foreground text-sm sm:text-base font-semibold block"
                >
                  Email
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter your email"
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

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-foreground text-sm sm:text-base font-semibold block"
                >
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`pl-4 pr-10 h-10 sm:h-12 rounded-md shadow-none text-foreground placeholder:text-muted-foreground text-sm sm:text-base ${errors.password
                      ? "border-error focus:border-error"
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
                  <p className="text-error text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 mb-10">
                <div className="inline-flex items-center gap-2 relative">
                  <Switch className="relative w-8 h-5" />
                  <Label className="relative w-fit text-sm lg:text-base cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-primary/80 font-semibold text-xs sm:text-sm hover:text-primary hover:underline transition-colors text-center sm:text-right"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <div className="w-full flex justify-center items-center my-5">
                <Button
                  type="submit"
                  size='lg'
                  className="w-1/2 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-indigo-500/20 bg-primary rounded-full"
                  disabled={isLoading || isSubmitting}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Log In...
                    </>
                  ) : (
                    "Log In"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
