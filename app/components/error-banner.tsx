import { CircleAlert } from "lucide-react";

export function ErrorBanner({ mensaje }: { mensaje?: string }) {
  if (!mensaje) return null;

  return (
    <div className="mt-6 flex items-start gap-3 rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
      <CircleAlert className="mt-0.5 size-4 shrink-0" />
      <p>{mensaje}</p>
    </div>
  );
}
