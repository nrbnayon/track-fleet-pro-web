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
import { Eye, EyeOff, Loader2, Mail, User, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Updated validation schema for signup with account type
const signupValidationSchema = z.object({
  accountType: z.enum(["business", "personal"]),
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  business_name: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => {
  if (data.accountType === "business" && !data.business_name) {
    return false;
  }
  return true;
}, {
  message: "Business name is required for business accounts",
  path: ["business_name"],
});

type RegisterFormData = z.infer<typeof signupValidationSchema>;

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState<"business" | "personal">("business");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(signupValidationSchema),
    defaultValues: {
      accountType: "business",
      full_name: "",
      business_name: "",
      email: "",
      password: "",
    },
  });

  const handleAccountTypeChange = (type: "business" | "personal") => {
    setAccountType(type);
    setValue("accountType", type);
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Store email for OTP verification
      localStorage.setItem("signupEmail", data.email);
      localStorage.setItem("otpSentTime", Date.now().toString());

      // Log the form data to console
      console.log("Registration Form Data:", {
        accountType: data.accountType,
        full_name: data.full_name,
        business_name: data.business_name,
        email: data.email,
        password: data.password,
        timestamp: new Date().toISOString(),
      });

      // Simulate successful registration
      toast.success("Registration initiated!", {
        description: `Please verify your email to complete registration.`,
        duration: 2000,
      });

      // Redirect to OTP verification
      setTimeout(() => {
        router.push("/verify-otp");
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
    <div className="bg-white w-full min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Already Signed up Section */}
      <aside className="hidden lg:flex w-full lg:w-[45%] xl:w-1/2 h-full lg:min-h-screen relative flex-col items-center justify-center gap-8 lg:gap-16 bg-[#DDEFFC] lg:rounded-[0px_16px_16px_0px] overflow-hidden px-6 py-12">
        <div className="flex flex-col w-35 lg:w-45 items-center gap-2 lg:gap-3 relative z-10">
          <div className="relative w-16 h-16 lg:w-45 lg:h-35">
            <img
              className="absolute top-0 left-0 w-16 h-16 lg:w-45 lg:h-35"
              alt="Logo icon"
              src="/icons/logo.svg"
            />
          </div>
        </div>

        <div className="flex flex-col w-full max-w-3xl lg:max-w-4xl items-center gap-4 lg:gap-6 relative z-10 px-4">
          <h1 className="relative font-bold text-foreground text-3xl lg:text-5xl text-center tracking-[0] leading-[36px] lg:leading-[57.6px]">
            Already Signed up?
          </h1>
          <p className="relative font-medium text-secondary text-lg lg:text-2xl text-center max-w-xl">
            Log in to your account so you can continue building and editing your onboarding flows.
          </p>
        </div>

        <Link href='/login' className="flex w-65 items-center justify-center py-2.5 text-white bg-primary rounded-full">
          Log In
        </Link>

        <div className="top-[-200px] lg:top-[-373px] left-[-150px] lg:left-[-257px] absolute w-[600px] lg:w-[850px] h-[350px] lg:h-[496px] bg-[#1d92ed99] rounded-[300px/175px] lg:rounded-[425px/248px] blur-[100px]" />
        <div className="bottom-[-200px] lg:bottom-[-92px] right-[-150px] lg:right-[-267px] absolute w-[200px] lg:w-[850px] h-[100px] lg:h-[150px] bg-[#1d92ed99] rounded-[300px/175px] lg:rounded-[425px/248px] blur-[100px]" />
      </aside>

      {/* ------------- Right side ------------- */}
      <div className="flex w-full lg:w-1/2 min-h-screen relative flex-col items-center justify-center gap-8 lg:gap-12 px-6 py-12 lg:px-8 xl:px-12">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-xl p-4 sm:p-8 rounded-md sm:rounded-lg lg:rounded-2xl border-none shadow-none bg-white">
          <CardHeader className="text-center">
            <h1 className="text-3xl lg:text-5xl font-bold text-primary mb-6">
              Create Account
            </h1>
          </CardHeader>
          <CardHeader className="text-center mb-6">
            <h2 className="text-base text-foreground">
              Register with Email
            </h2>
          </CardHeader>

          <div className="px-2 sm:px-4 lg:px-6">
            <form
              className="space-y-4 sm:space-y-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Account Type Toggle */}
              <div className="flex gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => handleAccountTypeChange("business")}
                  className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${accountType === "business"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  Business
                </button>
                <button
                  type="button"
                  onClick={() => handleAccountTypeChange("personal")}
                  className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${accountType === "personal"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  Personal
                </button>
              </div>

              {/* Full Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="full_name"
                  className="text-foreground text-sm sm:text-base font-semibold block"
                >
                  Full Name
                </label>
                <div className="relative">
                  <Input
                    id="full_name"
                    type="text"
                    placeholder="John Doe"
                    className={`pl-4 pr-10 h-10 sm:h-12 rounded-md shadow-none text-foreground placeholder:text-muted-foreground text-sm sm:text-base ${errors.full_name
                        ? "border-error focus:border-error"
                        : "input-focus"
                      }`}
                    {...register("full_name")}
                    disabled={isLoading}
                  />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                </div>
                {errors.full_name && (
                  <p className="text-error text-xs mt-1">
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              {/* Business Name Field - Only shown for business accounts */}
              {accountType === "business" && (
                <div className="space-y-2">
                  <label
                    htmlFor="business_name"
                    className="text-foreground text-sm sm:text-base font-semibold block"
                  >
                    Business Name
                  </label>
                  <div className="relative">
                    <Input
                      id="business_name"
                      type="text"
                      placeholder="Fresco Inc"
                      className={`pl-4 pr-10 h-10 sm:h-12 rounded-md shadow-none text-foreground placeholder:text-muted-foreground text-sm sm:text-base ${errors.business_name
                          ? "border-error focus:border-error"
                          : "input-focus"
                        }`}
                      {...register("business_name")}
                      disabled={isLoading}
                    />
                    <Building2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  </div>
                  {errors.business_name && (
                    <p className="text-error text-xs mt-1">
                      {errors.business_name.message}
                    </p>
                  )}
                </div>
              )}

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
                    placeholder="eg. mail@gmail.com"
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
                    placeholder="***************"
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

              {/* Sign Up Button */}
              <div className="w-full flex justify-center items-center mt-8">
                <Button
                  type="submit"
                  size='lg'
                  className="w-1/2 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-indigo-500/20 bg-primary rounded-full"
                  disabled={isLoading || isSubmitting}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sign Up...
                    </>
                  ) : (
                    "Sign Up"
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