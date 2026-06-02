"use client";

import { useState } from "react";
import { deleteJob } from "@/lib/actions/jobs";

export default function DeleteJobButton({ jobId }: { jobId: string }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <form action={deleteJob}>
          <input type="hidden" name="jobId" value={jobId} />
          <button
            type="submit"
            className="px-3 py-1.5 bg-red-500/90 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition whitespace-nowrap"
          >
            Yes, delete
          </button>
        </form>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 text-xs font-bold rounded-lg transition border border-white/10"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="px-3 py-1.5 bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-300 text-xs font-bold rounded-lg transition border border-white/10 whitespace-nowrap"
    >
      Delete
    </button>
  );
}
