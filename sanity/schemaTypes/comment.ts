import { defineField, defineType } from "sanity";

export const comment = defineType({
    name: "comment",
    title: "Comment",
    type: "document",
    fields: [
        defineField({
            name: "content",
            title: "Content",
            type: "text",
            validation: (Rule) => Rule.required().min(1).max(1000),
        }),
        defineField({
            name: "author",
            title: "Author",
            type: "reference",
            to: [{ type: "author" }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "startup",
            title: "Startup",
            type: "reference",
            to: [{ type: "startup" }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "parentComment",
            title: "Parent Comment (for replies)",
            type: "reference",
            to: [{ type: "comment" }],
        }),
    ],
    preview: {
        select: {
            title: "content",
            subtitle: "author.name",
        },
    },
});
