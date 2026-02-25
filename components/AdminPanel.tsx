"use client";

import { useState } from "react";
import { createCategory, deleteCategory } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Tag } from "lucide-react";
import { useRouter } from "next/navigation";

type Category = {
    _id: string;
    name: string;
};

export default function AdminPanel({ initialCategories }: { initialCategories: Category[] }) {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [newCatName, setNewCatName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCatName.trim()) return;

        setIsSubmitting(true);
        const res = await createCategory(newCatName);
        setIsSubmitting(false);

        if (res.status === "SUCCESS") {
            toast({ title: "Category added successfully" });
            setCategories([...categories, { _id: res._id, name: newCatName.trim() }]);
            setNewCatName("");
            router.refresh();
        } else {
            toast({ title: res.error || "Failed to add category", variant: "destructive" });
        }
    };

    const handleDeleteCategory = async (id: string) => {
        const res = await deleteCategory(id);
        if (res.status === "SUCCESS") {
            toast({ title: "Category deleted" });
            setCategories(categories.filter((c) => c._id !== id));
            router.refresh();
        } else {
            toast({ title: res.error || "Failed to delete category", variant: "destructive" });
        }
    };

    return (
        <div className="w-full bg-white border-[3px] border-black rounded-3xl p-6 shadow-100">
            <div className="flex items-center gap-3 mb-6 border-b-[3px] border-black pb-4">
                <div className="p-3 bg-primary/10 rounded-full border-2 border-primary">
                    <Tag className="size-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-24-black">Category Management</h2>
                    <p className="text-16-medium text-black-100">Add or remove startup categories globally.</p>
                </div>
            </div>

            <form onSubmit={handleAddCategory} className="flex gap-3 mb-8">
                <Input
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="New category name..."
                    className="startup-form_input !mt-0 flex-1"
                    disabled={isSubmitting}
                />
                <Button
                    type="submit"
                    disabled={!newCatName.trim() || isSubmitting}
                    className="h-[52px] px-6 rounded-full bg-primary hover:bg-black text-white font-bold text-16-medium border-[3px] border-black transition-colors flex items-center gap-2"
                >
                    <Plus className="size-5" />
                    Add Category
                </Button>
            </form>

            <div className="space-y-4">
                {categories.length > 0 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {categories.map((cat) => (
                            <li
                                key={cat._id}
                                className="flex items-center justify-between p-4 border-[3px] border-black rounded-2xl bg-gray-50 hover:bg-white transition-colors"
                            >
                                <span className="font-bold text-16-medium text-black">{cat.name}</span>
                                <button
                                    onClick={() => handleDeleteCategory(cat._id)}
                                    className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-full transition-colors border-2 border-transparent hover:border-black"
                                    title="Delete Category"
                                >
                                    <Trash2 className="size-5" />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-black-300 font-medium py-10 border-[3px] border-dashed border-gray-300 rounded-2xl">
                        No categories defined yet. Create some above!
                    </p>
                )}
            </div>
        </div>
    );
}
