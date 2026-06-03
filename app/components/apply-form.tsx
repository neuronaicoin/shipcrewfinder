"use client";

import { useState } from "react";
import { applyToJob } from "@/lib/actions/jobs";

const PRESETS = [
  "I'm interested in this position",
  "I'm available immediately",
  "I'd like to know more about this role",
];

export default function ApplyForm({ jobId }: { jobId: string }) {
  const [preset, setPreset] = useState(PRESETS[0]);
  const [custom, setCustom] = useState("");

  return (
    <form action={applyToJob} className="space-y-4">
      <input type="hidden" name="jobId" value={jobId} />
      <input type="hidden" name="preset" value={preset} />

      <div>
        <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">
          Quick message
        </label>
        <div className="space-y-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPreset(p)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition border ${
                preset === p
                  ? "bg-accent/15 border-accent text-white"
                  : "bg-primary border-white/15 text-white/70 hover:border-white/30"
              }`}
            >
              {preset === p && <span className="text-accent mr-2">✓</span>}
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="custom" className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">
          Add a note (optional)
        </label>
        <textarea
          id="custom"
          name="custom"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          rows={3}
          maxLength={400}
          placeholder="Anything you'd like the company to know..."
          className="w-full px-4 py-3 bg-primary border border-white/15 rounded-lg text-white text-sm placeholder-white/30 focus:border-accent focus:outline-none resize-y"
        />
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3.5 bg-accent hover:bg-accent-dark text-primary font-bold rounded-lg transition shadow-lg shadow-accent/20"
      >
        Apply Now
      </button>
      <p className="text-white/40 text-xs text-center">
        The company will be notified and can view your profile.
      </p>
    </form>
  );
}
