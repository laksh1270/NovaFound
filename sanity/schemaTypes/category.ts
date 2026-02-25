import { defineField, defineType } from "sanity";
import { TagIcon } from "lucide-react";

export const category = defineType({
    name: "category",
    title: "Category",
    type: "document",
    icon: TagIcon,
    fields: [
        defineField({
            name: "name",
            title: "Name",
            type: "string",
            validation: (Rule) => Rule.required().error("Category name is required"),
        }),
    ],
    preview: {
        select: {
            title: "name",
        },
    },
});
