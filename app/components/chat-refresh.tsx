"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ChatRefresh({ messageCount }: { messageCount: number }) {
  const router = useRouter();
  const lastCount = useRef(messageCount);

  useEffect(() => {
    // En alta kaydır (ilk açılış + yeni mesaj geldiğinde)
    const box = document.getElementById("chat-scroll");
    if (box) box.scrollTop = box.scrollHeight;
    lastCount.current = messageCount;
  }, [messageCount]);

  useEffect(() => {
    const t = setInterval(() => {
      router.refresh();
    }, 12000);
    return () => clearInterval(t);
  }, [router]);

  return null;
}
