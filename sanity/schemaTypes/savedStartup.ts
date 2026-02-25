import { defineField, defineType } from "sanity";

export const savedStartup = defineType({
    name: "savedStartup",
    title: "Saved Startup",
    type: "document",
    fields: [
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
    ],
    preview: {
        select: {
            title: "startup.title",
            subtitle: "author.name",
        },
    },
});
