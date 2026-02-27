"use client";

import React, { useState, useEffect, useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Send, X, UploadCloud, ChevronDown, Check } from "lucide-react";
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

export default function StartupForm({ categoriesList }: { categoriesList: string[] }) {
  const [pitch, setPitch] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [startupType, setStartupType] = useState<string>("private");
  const [typeOpen, setTypeOpen] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastRedirectedId = useRef<string | null>(null);

  const handleClearImage = () => {
    setImageFile(null);
    setPreviewUrl("");
    setImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
      }
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) {
        setTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const router = useRouter();
  const { toast } = useToast();

  const [state, formAction] = useActionState(createPitch, initialState);

  useEffect(() => {
    if (state.status === "SUCCESS" && state._id && state._id !== lastRedirectedId.current) {
      lastRedirectedId.current = state._id;
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

      {/* Multi-select Category Dropdown */}
      <div>
        <label className="startup-form-label">Category</label>
        <div ref={categoryRef} className="relative mt-3">
          <button
            type="button"
            onClick={() => setCategoryOpen((prev) => !prev)}
            className="startup-form_input w-full flex items-center justify-between !mt-0"
          >
            <span className={selectedCategories.length ? "text-black font-bold" : "text-black-300"}>
              {selectedCategories.length
                ? selectedCategories.join(", ")
                : "Select categories..."}
            </span>
            <ChevronDown
              className={`size-5 text-black transition-transform ${categoryOpen ? "rotate-180" : ""}`}
            />
          </button>

          {categoryOpen && (
            <div className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto rounded-xl border-[3px] border-black bg-white shadow-lg">
              {categoriesList && categoriesList.length > 0 ? (
                categoriesList.map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`w-full flex items-center gap-3 px-5 py-3 text-[16px] font-bold transition-colors ${isSelected
                        ? "bg-primary/10 text-primary"
                        : "text-black hover:bg-gray-100"
                        }`}
                    >
                      <span
                        className={`flex items-center justify-center w-5 h-5 rounded border-[2.5px] shrink-0 ${isSelected
                          ? "bg-primary border-primary text-white"
                          : "border-black"
                          }`}
                      >
                        {isSelected && <Check className="size-3" />}
                      </span>
                      {cat}
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-center text-sm font-bold text-black-100">
                  No categories found. Ask the admin to create some!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected tags */}
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedCategories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[14px] font-bold"
              >
                {cat}
                <button
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className="hover:text-red-500 transition-colors"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Hidden input for form submission */}
        <input type="hidden" name="category" value={selectedCategories.join(", ")} />
      </div>

      {/* Startup Type Dropdown */}
      <div>
        <label className="startup-form-label">Startup Type</label>
        <div ref={typeRef} className="relative mt-3">
          <input type="hidden" name="startupType" value={startupType} />
          <button
            type="button"
            onClick={() => setTypeOpen((prev) => !prev)}
            className="startup-form_input w-full flex items-center justify-between !mt-0"
          >
            <span className="text-black font-bold capitalize">
              {startupType}
            </span>
            <ChevronDown
              className={`size-5 text-black transition-transform ${typeOpen ? "rotate-180" : ""}`}
            />
          </button>

          {typeOpen && (
            <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border-[3px] border-black bg-white shadow-lg">
              {["private", "government"].map((type) => {
                const isSelected = startupType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setStartupType(type);
                      setTypeOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-5 py-3 text-[16px] font-bold capitalize transition-colors ${isSelected
                      ? "bg-primary text-white"
                      : "text-black hover:bg-gray-100"
                      }`}
                  >
                    <span>{type}</span>
                    {isSelected && <Check className="size-4 ml-auto text-white" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="startup-form-label">Image (Upload or Add URL)</label>
        <div className="flex flex-col gap-4 mt-3">
          <Input
            name="imageUrl"
            placeholder="Image URL"
            className="startup-form_input !mt-0"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              if (e.target.value) {
                setImageFile(null);
                setPreviewUrl("");
                if (fileInputRef.current) fileInputRef.current.value = "";
              }
            }}
            disabled={!!imageFile}
            required={!imageFile}
          />

          <div className="flex items-center gap-2 mt-2 mb-2">
            <div className="h-[2px] bg-black-100 flex-1"></div>
            <span className="font-bold text-black-100 px-2">OR</span>
            <div className="h-[2px] bg-black-100 flex-1"></div>
          </div>

          <div className={`relative border-[3px] border-dashed border-black rounded-2xl p-10 flex flex-col items-center justify-center gap-3 hover:bg-primary-100 transition-colors cursor-pointer ${(imageFile || imageUrl) ? 'opacity-50 pointer-events-none bg-gray-100' : 'bg-white'}`}>
            <Input
              type="file"
              name="imageFile"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 10 * 1024 * 1024) {
                    toast({
                      title: "File too large",
                      description: "Please select an image smaller than 10MB",
                      variant: "destructive",
                    });
                    handleClearImage();
                    return;
                  }
                  setImageFile(file);
                  setImageUrl(""); // Clear URL if file is selected

                  // Create preview URL
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreviewUrl(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                } else {
                  handleClearImage();
                }
              }}
              disabled={!!imageUrl && imageUrl.length > 0}
              required={!imageUrl}
            />
            <UploadCloud className="w-12 h-12 text-black" />
            <p className="font-bold text-black text-[16px]">Drag and drop your startup image</p>
            <p className="text-black-100 font-medium text-sm">Or click to browse from your device</p>
          </div>
        </div>
      </div>

      {(previewUrl || imageUrl) && (
        <div className="mt-4 border-[3px] border-black rounded-xl overflow-hidden aspect-[16/6] relative flex items-center justify-center bg-gray-50 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl || imageUrl}
            alt="Startup Image Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAyNCAyNCI+PHRleHQgY29sb3I9IiM5OTkiIHk9IjUyJSIgeD0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbnZhbGlkIEltYWdlIFVSTDwvdGV4dD48L3N2Zz4='
            }}
          />
          <Button
            type="button"
            title="Remove Image"
            className="absolute top-4 right-4 z-20 rounded-full h-10 w-10 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-primary border-[3px] border-black hover:bg-black hover:text-white"
            onClick={handleClearImage}
          >
            <X className="h-5 w-5 font-bold" />
          </Button>
        </div>
      )}

      <div data-color-mode="light">
        <label className="startup-form-label">Pitch</label>
        <MDEditor value={pitch} onChange={(v) => setPitch(v || "")} height={300} />
      </div>

      <div className="border-[3px] border-black rounded-2xl p-5 bg-white">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowContact(!showContact)}>
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full border-[3px] border-black flex items-center justify-center transition-colors ${showContact ? 'bg-primary border-primary text-white' : 'bg-white'}`}>
              <Check className={`size-4 opacity-${showContact ? '100' : '0'}`} />
            </div>
            <span className="font-bold text-16-medium block">Add Optional Contact Info</span>
          </div>
          <ChevronDown className={`transition-transform size-6 ${showContact ? "rotate-180" : ""}`} />
        </div>

        {showContact && (
          <div className="mt-5 space-y-4 pt-4 border-t-[3px] border-dashed border-gray-200">
            <div>
              <label htmlFor="email" className="font-bold text-sm block mb-1">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="founder@startup.com"
                className="startup-form_input !mt-0 h-10 text-sm"
              />
            </div>
            <div>
              <label htmlFor="phone" className="font-bold text-sm block mb-1">Phone Number</label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                className="startup-form_input !mt-0 h-10 text-sm"
              />
            </div>
            <div>
              <label htmlFor="address" className="font-bold text-sm block mb-1">Location / Address</label>
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="San Francisco, CA"
                className="startup-form_input !mt-0 h-10 text-sm"
              />
            </div>
            <div>
              <label htmlFor="website" className="font-bold text-sm block mb-1">Website URL</label>
              <Input
                id="website"
                name="website"
                type="url"
                placeholder="https://yourstartup.com"
                className="startup-form_input !mt-0 h-10 text-sm"
              />
            </div>
          </div>
        )}
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
