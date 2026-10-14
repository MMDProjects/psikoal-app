export { useAuthStore } from './store/authStore'
export {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useFreezeAccountMutation,
  useDeleteAccountMutation,
  useUploadAvatarMutation,
  useMeQuery,
  useResetPasswordMutation,
  RESET_TOKEN_INVALID,
} from './api'
export { parseRecoveryLink } from './utils/parseRecoveryLink'
export type { RecoveryLink } from './utils/parseRecoveryLink'
export { authKeys } from './auth.constants'
export { useChangeAvatar } from './hooks/useChangeAvatar'
export {
  pickAvatarImage,
  resolveImageContentType,
  AVATAR_CONTENT_TYPES,
  AVATAR_MAX_BYTES,
} from './utils/pickAvatarImage'
export type { PickedImage, PickImageResult } from './utils/pickAvatarImage'
export {
  LoginRequestSchema,
  RegisterRequestSchema,
  AuthUserSchema,
  UserRoleSchema,
  LoginResponseSchema,
  UpdateProfileSchema,
  ChangePasswordSchema,
  ForgotPasswordSchema,
  ResetPasswordFormSchema,
  ResetPasswordRequestSchema,
} from './schemas/auth.schema'
export type {
  UserRole,
  AuthUser,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordForm,
  ResetPasswordRequest,
} from './types/auth.types'
export { RoleCard } from './components/RoleCard'
export type { RoleCardProps } from './components/RoleCard'
