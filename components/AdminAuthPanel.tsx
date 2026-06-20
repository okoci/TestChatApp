"use client";

type AdminAuthPanelProps = {
  isAdmin: boolean;
  isGoogleSignedIn: boolean;
  isLoading: boolean;
  error: string | null;
  onGoogleSignIn: () => void;
  onAdminSignOut: () => void;
};

export default function AdminAuthPanel({
  isAdmin,
  isGoogleSignedIn,
  isLoading,
  error,
  onGoogleSignIn,
  onAdminSignOut,
}: AdminAuthPanelProps) {
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2">
      {isAdmin ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium text-amber-900">管理者モード</p>
          <button
            type="button"
            onClick={onAdminSignOut}
            disabled={isLoading}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-amber-900 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "処理中..." : "管理者ログアウト"}
          </button>
        </div>
      ) : isGoogleSignedIn ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-amber-800">
            この Google アカウントには管理者権限がありません。
          </p>
          <button
            type="button"
            onClick={onAdminSignOut}
            disabled={isLoading}
            className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-amber-900 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "処理中..." : "ログアウト"}
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-amber-800">管理者としてログイン</p>
          <button
            type="button"
            onClick={onGoogleSignIn}
            disabled={isLoading}
            className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm ring-1 ring-amber-200 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "処理中..." : "Google でログイン"}
          </button>
        </div>
      )}

      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
