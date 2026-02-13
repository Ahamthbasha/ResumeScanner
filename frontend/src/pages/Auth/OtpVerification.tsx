import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { type AxiosError } from "axios";
import InputField from "../../components/common/InputField"; 
import { verifyOTP, resendOTP } from '../../api/auth/userAuth'

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

type OTPForm = z.infer<typeof otpSchema>;

interface LocationState {
  email: string;
  expiresIn?: number;
}

interface ErrorResponse {
  success: boolean;
  message?: string;
  data?: {
    expiresIn?: number;
  };
}

interface ResendOTPResponse {
  success: boolean;
  message?: string;
  data?: {
    expiresIn?: number;
  };
}

export default function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    resetField,
  } = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (!state?.email) {
      toast.error("No registration session found. Please register again.");
      navigate("/register");
    }
  }, [state, navigate]);

  useEffect(() => {
    if (state?.expiresIn) {
      setTimer(state.expiresIn);
    }
  }, [state]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer]);

  const onSubmit = async (data: OTPForm) => {
    if (!state?.email) return;
    
    setIsVerifying(true);
    try {
      const res = await verifyOTP({ 
        email: state.email, 
        otp: data.otp 
      });

      if (res.success) {
        toast.success(res.message || "Email verified successfully! Your account has been created.");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      toast.error(err.response?.data?.message || "OTP verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (!state?.email) return;
    
    setIsResending(true);
    try {
      const res = await resendOTP({ email: state.email }) as ResendOTPResponse;
      
      if (res.success) {
        toast.success(res.message || "OTP resent successfully!");
        
        resetField("otp", { 
          defaultValue: "",
          keepError: false,
          keepTouched: false,
          keepDirty: false
        });
        
        setValue("otp", "", { 
          shouldValidate: false,
          shouldDirty: false,
          shouldTouch: false 
        });
        
        const expiresIn = res.data?.expiresIn || 60;
        setTimer(expiresIn);
        setCanResend(false);
      }
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      toast.error(err.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleGoBack = () => {
    navigate("/register");
  };

  const maskEmail = (email: string) => {
    if (!email) return "";
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 3) {
      return `${localPart}***@${domain}`;
    }
    return `${localPart.substring(0, 3)}***${localPart.substring(localPart.length - 1)}@${domain}`;
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("otp", value, { shouldValidate: true });
    
    if (value.length === 6 && /^\d+$/.test(value)) {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
              <span className="text-4xl text-white">📧</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Verify Your Email
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              We've sent a verification code to
            </p>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-700 px-4 py-2 rounded-lg inline-block">
              {state?.email ? maskEmail(state.email) : ""}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <InputField
                label="Enter Verification Code"
                id="otp"
                type="text"
                placeholder="123456"
                {...register("otp")}
                onChange={handleOtpChange}
                error={errors.otp?.message}
                maxLength={6}
                autoComplete="off"
                autoFocus={true}
              />
            </div>

            <div className="text-center">
              {!canResend ? (
                <p className="text-gray-600 dark:text-gray-400">
                  Code expires in{" "}
                  <span className="inline-flex items-center justify-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full font-mono font-bold text-blue-600 dark:text-blue-400">
                    {timer}s
                  </span>
                </p>
              ) : (
                <p className="text-red-500 dark:text-red-400 font-medium">
                  ⚠️ Code expired. Please request a new one.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="
                w-full flex justify-center items-center py-3 px-4 
                bg-gradient-to-r from-blue-600 to-purple-600 
                hover:from-blue-700 hover:to-purple-700
                text-white font-semibold rounded-lg
                focus:outline-none focus:ring-4 focus:ring-blue-500/50
                transition-all duration-200 transform hover:scale-[1.02]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              "
            >
              {isVerifying ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                "Verify & Create Account"
              )}
            </button>

            <div className="text-center space-y-3">
              <p className="text-gray-600 dark:text-gray-400">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={!canResend || isResending}
                  className={`
                    font-semibold transition-colors
                    ${canResend && !isResending
                      ? "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer" 
                      : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                    }
                  `}
                >
                  {isResending ? "Sending..." : "Resend OTP"}
                </button>
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleGoBack}
                className="
                  w-full flex items-center justify-center space-x-2
                  text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200
                  transition-colors duration-200
                "
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Registration</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}