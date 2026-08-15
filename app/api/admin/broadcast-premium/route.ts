const { createAdminClient } = await import("@/lib/supabase/admin");
      const admin = createAdminClient();

      const { data: secretRow } = await admin
        .from("app_secrets")
        .select("value")
        .eq("key", "resend_api_key")
        .single();
      const resendKey = secretRow?.value as string | undefined;

      const email = refProfile?.email as string | null;
      if (email && resendKey) {
        const refCode = (refProfile?.referral_code as string) || "";
        const link = `https://shipcrewfinder.com/signup/crew?ref=${refCode}`;
        const firstName = ((refProfile?.full_name as string) || "there").split(" ")[0];

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
