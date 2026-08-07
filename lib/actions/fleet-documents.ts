"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function requireCompanyUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();

  if (!profile || profile.user_type !== "company") redirect("/dashboard");

  return { supabase, userId: user.id };
}

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export async function uploadFleetDocument(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireCompanyUser();

  const crewId = (formData.get("crewId") as string) || "";
  const vesselId = (formData.get("vesselId") as string) || "";
  const docType = ((formData.get("docType") as string) || "Other").trim().slice(0, 60);
  const docName = ((formData.get("docName") as string) || "").trim().slice(0, 100);
  const expiryDate = (formData.get("expiryDate") as string) || "";
  const file = formData.get("file") as File | null;

  if (!crewId || !vesselId) redirect("/fleet");
  if (!file || file.size === 0) {
    redirect(`/fleet/${vesselId}/${crewId}?docerror=missing`);
  }

  if (file.size > 10 * 1024 * 1024) {
    redirect(`/fleet/${vesselId}/${crewId}?docerror=toolarge`);
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    redirect(`/fleet/${vesselId}/${crewId}?docerror=badtype`);
  }

  // Sahiplik doğrulaması
  const { data: crew } = await supabase
    .from("fleet_crew")
    .select("id")
    .eq("id", crewId)
    .eq("company_id", userId)
    .maybeSingle();

  if (!crew) redirect("/fleet");

  const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${userId}/${crewId}/${Date.now()}-${safeFileName}`;

  const { error: uploadError } = await supabase.storage
    .from("fleet-documents")
    .upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    redirect(`/fleet/${vesselId}/${crewId}?docerror=failed`);
  }

  const { error: dbError } = await supabase.from("fleet_crew_documents").insert({
    crew_id: crewId,
    company_id: userId,
    doc_type: docType,
    name: docName || file.name,
    expiry_date: expiryDate || null,
    file_url: storagePath,
  });

  if (dbError) {
    // DB kaydı başarısızsa yüklenen dosyayı da temizle
    await supabase.storage.from("fleet-documents").remove([storagePath]);
    redirect(`/fleet/${vesselId}/${crewId}?docerror=failed`);
  }

  revalidatePath(`/fleet/${vesselId}/${crewId}`);
  redirect(`/fleet/${vesselId}/${crewId}?docadded=1`);
}

export async function deleteFleetDocument(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireCompanyUser();

  const docId = (formData.get("docId") as string) || "";
  const vesselId = (formData.get("vesselId") as string) || "";
  const crewId = (formData.get("crewId") as string) || "";
  if (!docId) redirect("/fleet");

  const { data: doc } = await supabase
    .from("fleet_crew_documents")
    .select("file_url")
    .eq("id", docId)
    .eq("company_id", userId)
    .maybeSingle();

  if (doc?.file_url) {
    await supabase.storage.from("fleet-documents").remove([doc.file_url as string]);
  }

  await supabase
    .from("fleet_crew_documents")
    .delete()
    .eq("id", docId)
    .eq("company_id", userId);

  revalidatePath(`/fleet/${vesselId}/${crewId}`);
  redirect(`/fleet/${vesselId}/${crewId}?docdeleted=1`);
}
