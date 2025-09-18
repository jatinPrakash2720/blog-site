export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

//Sign In Page
export interface SignInPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
  onResetPassword?: () => void;
  onCreateAccount?: () => void;
}

//SignUp In Page
export interface SignUpPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  onSignUp?: (event: React.FormEvent<HTMLFormElement>) => void;
  onSignIn?: () => void;
}

//Restore Password Page

export interface RestorePasswordProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  onRestorePassword?: (password: string) => Promise<boolean>;
  onGoToSignIn?: () => void;
  onGoBack?: () => void;
}

//Profile Setup Page
export interface ProfileSetupProps {
  onComplete?: (profileData: { avatar?: File; coverImage?: File }) => void;
  onSkip?: () => void;
}

//

export interface OTPVerificationPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  email?: string;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  onVerifyOTP?: (otp: string) => void;
  onResendCode?: () => void;
  onGoBack?: () => void;
  codeLength?: number;
}


//Forgot Password Page

export interface ForgotPasswordProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  onResetPassword?: (identifier: string) => Promise<boolean>;
  onGoBack?: () => void;
}