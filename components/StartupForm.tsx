"use client";

import React, { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";

const initialState = {
  status: "INITIAL",
  error: "",
  _id: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending}>
      {pending ? "Submitting..." : "Submit Your Pitch"}
      <Send className="ml-2 h-4 w-4" />
    </Button>
  );
}

export default function StartupForm() {
  const [pitch, setPitch] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const [state, formAction] = useFormState(createPitch, initialState);

  useEffect(() => {
    if (state.status === "SUCCESS") {
      toast({ title: "Startup created 🚀" });
      router.push(`/startup/${state._id}`);
    }

    if (state.status === "ERROR") {
      toast({
        title: state.error,
        variant: "destructive",
      });
    }
  }, [state, router, toast]);

  return (
    <form action={formAction} className="startup-form space-y-6">
      <div>
        <label className="startup-form-label">Title</label>
        <Input name="title" required className="startup-form_input" />
      </div>

      <div>
        <label className="startup-form-label">Description</label>
        <Textarea name="description" required className="startup-form_textarea" />
      </div>

      <div>
        <label className="startup-form-label">Category</label>
        <Input name="category" required className="startup-form_input" />
      </div>

      <div>
        <label className="startup-form-label">Image URL</label>
        <Input name="imageUrl" required className="startup-form_input" />
      </div>

      <div data-color-mode="light">
        <label className="startup-form-label">Pitch</label>
        <MDEditor value={pitch} onChange={(v) => setPitch(v || "")} height={300} />
      </div>

      {/* IMPORTANT */}
      <input type="hidden" name="pitch" value={pitch} />

      <SubmitButton />

      {state?.error && (
        <p className="startup-form_errors">{state.error}</p>
      )}
    </form>
  );
}
