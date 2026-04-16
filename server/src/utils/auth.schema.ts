import { z } from 'zod';

const phoneRegex = /^[0-9]{10}$/;

export const registerSchema = z.object({
  body: z.object({
    phoneNumber: z.string()
      .transform(val => val.replace(/\D/g, ''))
      .refine(val => val.length === 10, 'Invalid phone number. Must be 10 digits.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    name: z.string().min(2, 'Name must be at least 2 characters.'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    phoneNumber: z.string()
      .transform(val => val.replace(/\D/g, ''))
      .refine(val => val.length === 10, 'Invalid phone number format.'),
    password: z.string().min(1, 'Password is required.'),
  }),
});

export const forgotPasswordOtpSchema = z.object({
  body: z.object({
    phoneNumber: z.string().regex(phoneRegex, 'Invalid phone number format.'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    phoneNumber: z.string().regex(phoneRegex, 'Invalid phone number.'),
    otp: z.string().length(6, 'OTP must be 6 digits.'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters.'),
  }),
});
