"use client";

import { deleteStartup } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  id: string;
};

export default function DeleteStartupButton({ id }: Props) {
  const router = useRouter();

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [showConfirm, setShowConfirm] = useState(false);

  // auto hide toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleDelete = async () => {
    const res = await deleteStartup(id);

    if (res.status === "SUCCESS") {
      setToast({
        message: "Startup deleted successfully",
        type: "success",
      });
      router.refresh();
    } else {
      setToast({
        message: res.error || "Delete failed",
        type: "error",
      });
    }

    setShowConfirm(false);
  };

  return (
    <>
      {/* Delete Button */}
      <button
        onClick={() => setShowConfirm(true)}
        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
      >
        Delete
      </button>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[300px] rounded-xl bg-white p-6 shadow-xl">
            <p className="text-sm font-medium text-black">
              Are you sure you want to delete this startup?
            </p>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-md border px-3 py-1 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-xl px-5 py-3 text-sm font-medium shadow-lg ${
            toast.type === "success"
              ? "bg-black text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}
    </>
  );
}
