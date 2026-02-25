import { defineField, defineType } from "sanity";

export const startup = defineType({
  name: "startup",
  title: "Startup",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
    }),
    defineField({
      name: "author",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "views",
      type: "number",
    }),
    defineField({
      name: "description",
      type: "text",
    }),
    defineField({
      name: "category",
      type: "string",
      validation: (Rule) =>
        Rule.min(1).max(20).required().error("Please enter a category"),
    }),
    defineField({
      name: "image",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pitch",
      type: "markdown",
    }),
    defineField({
      name: "startupType",
      title: "Startup Type",
      type: "string",
      options: {
        list: [
          { title: "Private", value: "private" },
          { title: "Government", value: "government" },
          { title: "Both", value: "both" },
        ],
      },
      initialValue: "private",
    }),
    defineField({
      name: "contactInfo",
      title: "Contact Information",
      type: "object",
      fields: [
        { name: "email", type: "string", title: "Email" },
        { name: "phone", type: "string", title: "Phone Number" },
        { name: "address", type: "string", title: "Address / Location" },
        { name: "website", type: "url", title: "Website URL" },
      ],
    }),
  ],
});