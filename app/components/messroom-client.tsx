"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function MessRoomClient({ messageCount }: { messageCount: number }) {
  const router = useRouter();
  const lastCount = useRef(messageCount);

  // Yeni mesajda / ilk açılışta en alta kaydır
  useEffect(() => {
    const box = document.getElementById("mess-scroll");
    if (box) box.scrollTop = box.scrollHeight;
    lastCount.current = messageCount;
  }, [messageCount]);

  // 10 sn'de bir canlı yenileme
  useEffect(() => {
    const t = setInterval(() => {
      router.refresh();
    }, 10000);
    return () => clearInterval(t);
  }, [router]);

  // İsme tıkla → @handle inputa eklensin
  useEffect(() => {
    const handler = (e: Event) => {
      const el = (e.target as HTMLElement).closest("[data-handle]") as HTMLElement | null;
      if (!el) return;
      const h = el.getAttribute("data-handle");
      if (!h) return;
      const input = document.getElementById("mess-input") as HTMLInputElement | null;
      if (!input) return;
      const tag = "@" + h + " ";
      if (!input.value.includes(tag)) input.value = (input.value + " " + tag).trimStart();
      input.focus();
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return null;
}
