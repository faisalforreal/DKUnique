import { defineField, defineType } from "sanity";

export const serviceType = defineType({
  name: "service",
  title: "Service / Rental",
  type: "document",
  fields: [
    defineField({
      name: "id",
      title: "Service ID",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name",
      title: "Service Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      initialValue: "rental",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "specs",
      title: "Specifications",
      type: "array",
      of: [
        defineField({
          name: "specItem",
          title: "Spec Item",
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "value", title: "Value", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "priceApprox",
      title: "Approximate Price",
      type: "number",
    }),
    defineField({
      name: "priceUnit",
      title: "Price Unit",
      type: "string",
    }),
    defineField({
      name: "flagged",
      title: "Flagged",
      type: "boolean",
    }),
    defineField({
      name: "flagNotes",
      title: "Flag Notes",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "object",
      fields: [
        defineField({ name: "src", title: "Source", type: "string" }),
        defineField({ name: "alt", title: "Alt", type: "string" }),
        defineField({ name: "width", title: "Width", type: "number" }),
        defineField({ name: "height", title: "Height", type: "number" }),
      ],
    }),
  ],
});
