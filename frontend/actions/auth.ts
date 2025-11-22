"use server"
import { z } from "zod"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { SignupFormSchema, type FormState } from "@/validations/auth"
import { registerUserService } from "@/lib/strapi"

const cookieConfig = {
  maxAge: 60 * 60 * 24 * 7, // 1 week,
  path: '/',
  httpOnly: true, // only accessible by the server
  domain: process.env.HOST ?? 'localhost',
  secure: process.env.NODE_ENV === 'production',
}

export async function registerUserAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  console.log('Hello from Register User Action')

  const getString = (key: string): string | undefined => {
    const value = formData.get(key)
    return typeof value === 'string' ? value : undefined
  }

  const fields: FormState["data"] = {
    username: getString('username'),
    password: getString('password'),
    email: getString('email'),
    // identifier: getString('identifier'), // si lo llegaras a usar
  }

  const validatedFields = SignupFormSchema.safeParse(fields)

  if (!validatedFields.success) {
    const flattenedErrors = validatedFields.error.flatten()

    console.log("Validation errors:", flattenedErrors.fieldErrors)

    return {
      success: false,
      message: "Validation error",
      strapiErrors: null,
      zodErrors: flattenedErrors.fieldErrors,
      data: fields 
    }
  }

  const response = await registerUserService(validatedFields.data)

  if (!response || response.error) {
    return {
      success: false,
      message: "Registration error",
      strapiErrors: response?.error,
      zodErrors: null,
      data: fields       // ✅ igual aquí
    }
  }

  const cookieStore = await cookies()
  cookieStore.set('jwt', response.jwt, cookieConfig)
  redirect('/dashboard')
}