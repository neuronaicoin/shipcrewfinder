"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// ============================================
// CREW SIGNUP (Ship Crew or Yacht Crew)
// ============================================
export async function signupCrew(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const crewType = formData.get("crewType") as string; // "seafarer" or "yacht"

  if (!email || !password || !fullName || !crewType) {
    return { error: "All fields are required" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  // Sign up with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://shipcrewfinder.com"}/auth/confirm`,
      data: {
        full_name: fullName,
        user_type: crewType,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "Failed to create account" };
  }

  // Insert into profiles table
  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    user_type: crewType,
    full_name: fullName,
    email: email,
    visibility: "hidden", // Hidden until onboarding complete
  });

  if (profileError) {
    console.error("Profile insert error:", profileError);
    // Don't fail the signup, profile can be created later
  }

  redirect("/auth/check-email");
}

// ============================================
// COMPANY SIGNUP
// ============================================
export async function signupCompany(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const contactName = formData.get("contactName") as string;
  const companyName = formData.get("companyName") as string;

  if (!email || !password || !contactName || !companyName) {
    return { error: "All fields are required" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://shipcrewfinder.com"}/auth/confirm`,
      data: {
        full_name: contactName,
        user_type: "company",
        company_name: companyName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "Failed to create account" };
  }

  // Insert into profiles
  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    user_type: "company",
    full_name: contactName,
    email: email,
    visibility: "hidden",
  });

  if (profileError) {
    console.error("Profile insert error:", profileError);
  }

  // Insert into company_details
  const { error: companyError } = await supabase.from("company_details").insert({
    id: data.user.id,
    company_name: companyName,
  });

  if (companyError) {
    console.error("Company details insert error:", companyError);
  }

  redirect("/auth/check-email");
}

// ============================================
// LOGIN
// ============================================
export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

// ============================================
// LOGOUT
// ============================================
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
