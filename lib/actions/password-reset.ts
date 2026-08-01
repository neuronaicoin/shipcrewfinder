"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requestPasswordReset(formData: FormData): Promise<void> {
  const email = ((formData.get("email") as string) || "").trim();
  if (!email || !email.includes("@")) {
    redirect("/forgot-password?error=1");
  }

  const supabase = await createClient();
  // Supabase'e bu adresi bildirmesini söylüyoruz; sitenin kendi domain'ine dönecek
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "https://shipcrewfinder.com/update-password",
  });

  // Güvenlik: mail var mı yok mu belli etmeyiz — her durumda "gönderildi" deriz
  redirect("/forgot-password?sent=1");
}

export async function updatePassword(formData: FormData): Promise<void> {
  const password = (formData.get("password") as string) || "";
  const confirm = (formData.get("confirm") as string) || "";

  if (password.length < 8) {
    redirect("/update-password?error=short");
  }
  if (password !== confirm) {
    redirect("/update-password?error=mismatch");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/update-password?error=expired");
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    redirect("/update-password?error=failed");
  }

  redirect("/login?reset=1");
}
