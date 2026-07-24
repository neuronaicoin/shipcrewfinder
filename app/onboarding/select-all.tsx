"use client";

export default function SelectAll({ containerId }: { containerId: string }) {
  const toggle = (check: boolean) => {
    const box = document.getElementById(containerId);
    if (!box) return;
    box
      .querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
      .forEach((c) => {
        c.checked = check;
      });
  };

  return (
    <span className="inline-flex gap-2">
      <button
        type="button"
        onClick={() => toggle(true)}
        className="px-3 py-1 text-accent text-xs font-bold border border-accent/30 bg-accent/10 rounded-lg hover:bg-accent/20 transition"
      >
        Select all
      </button>
      <button
        type="button"
        onClick={() => toggle(false)}
        className="px-3 py-1 text-white/50 text-xs font-bold border border-white/10 rounded-lg hover:text-white/80 transition"
      >
        Clear
      </button>
    </span>
  );
}
