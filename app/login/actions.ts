'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { isValidEmail, isValidPassword } from '@/lib/validate-login'

import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()
  
    const email = formData.get('email') as string
    const password = formData.get('password') as string
  
    const { error } = await supabase.auth.signInWithPassword({ email, password })
  
    if (error) {
      return { error: error.message }
    }
  
    revalidatePath('/', 'layout')
    redirect('/')
  }
  
  export async function signup(formData: FormData) {
    const supabase = await createClient()
  
    const email = formData.get('email') as string
    const password = formData.get('password') as string
  
    if (!isValidEmail(email)) {
      return { error: 'Invalid email format' }
    }
  
    if (!isValidPassword(password)) {
      return { error: 'Password must be at least 6 characters' }
    }
  
    const { data, error } = await supabase.auth.signUp({ email, password })
  
    if (error) {
      return { error: error.message }
    }

    // Email confirmation is always required
    if (data.user && !data.session) {
      // Success - user created, email confirmation sent
      return { success: 'Account created successfully! Please check your email to confirm your account before logging in.' }
    }
  
    // Fallback - should not reach here
    return { error: 'Signup completed but unable to sign in. Please try logging in.' }
  }
  

export async function changePassword(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: formData.get('password') as string,
  })

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function sendPasswordReset(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string
  
    const { error } = await supabase.auth.resetPasswordForEmail(email)
  
    if (error) {
      redirect('/error')
    }
  
    redirect('/check-your-email')
  }

export async function logout() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}
  