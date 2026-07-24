"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// ============================================
// Belge ekle (opsiyonel PDF ile)
// ============================================
export async function addDocument(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const docType = (formData.get("docType") as string) || "";
  const name = ((formData.get("name") as string) || "").trim();
  const expiryDate = (formData.get("expiryDate") as string) || "";
  const file = formData.get("file") as File | null;

  if (!docType || !name) {
    redirect("/vault?error=missing");
  }

  // Opsiyonel dosya yükleme (mevcut cvs bucket'ı, kanıtlanmış yol)
  let fileUrl: string | null = null;
  if (file && file.size > 0) {
    if (file.size > 5 * 1024 * 1024) {
      redirect("/vault?error=file_too_large");
    }
    if (file.type !== "application/pdf") {
      redirect("/vault?error=invalid_type");
    }
    const fileName = "doc-" + user.id + "-" + Date.now() + ".pdf";
    const { error: uploadError } = await supabase.storage
      .from("cvs")
      .upload(fileName, file, {
        upsert: true,
        contentType: "application/pdf",
      });
    if (uploadError) {
      redirect("/vault?error=upload_failed");
    }
    const { data: { publicUrl } } = supabase.storage
      .from("cvs")
      .getPublicUrl(fileName);
    fileUrl = publicUrl;
  }

  const { error } = await supabase.from("crew_documents").insert({
    user_id: user.id,
    doc_type: docType,
    name: name,
    expiry_date: expiryDate || null,
    file_url: fileUrl,
  });

  if (error) {
    redirect("/vault?error=failed");
  }

  revalidatePath("/vault");
  redirect("/vault?added=1");
}

// ============================================
// Belge sil
// ============================================
export async function deleteDocument(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const docId = (formData.get("docId") as string) || "";
  if (!docId) redirect("/vault");

  await supabase
    .from("crew_documents")
    .delete()
    .eq("id", docId)
    .eq("user_id", user.id);

  revalidatePath("/vault");
  redirect("/vault?deleted=1");
}
