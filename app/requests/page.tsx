import { redirect } from "next/navigation";

// Connection request system removed — package-based visibility is used instead.
export default function RequestsPage() {
  redirect("/dashboard");
}
