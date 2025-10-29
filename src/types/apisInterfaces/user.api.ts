export interface LoginData {
  email?: string;
  username?: string;
  password: string;
  saveLogin: boolean;
}

export interface SignUpData {
  username: string;
  email: string;
  password: string;
  saveLogin: boolean;
}

export interface VerifyUserData {
  email: string;
  code: string;
  saveLogin: boolean;
}

export interface ChangePasswordData {
  newPassword?: string;
  newConfirmPassword?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
export interface ForgotPasswordData {
  identifier: string;
}
export interface ResetPasswordData {
  password?: string;
  confirmPassword?: string;
}

export interface UpdateUserFullNameData {
  fullName: string;
}
export interface UpdateUserEmailData {
  email: string;
}
export interface UpdateUserAvatarData {
  avatarFormData: FormData;
}
export interface UpdateUserCoverImageData {
  coverImageFormData: FormData;
}
