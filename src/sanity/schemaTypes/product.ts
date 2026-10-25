import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "id",
      title: "Product ID",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name",
      title: "Product Name",
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
      name: "categorySlug",
      title: "Category Slug",
      type: "string",
      validation: (rule) => rule.required(),
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
          title: "Specification Item",
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "value", title: "Value", type: "string" }),
            defineField({ name: "flagged", title: "Flagged", type: "boolean" }),
            defineField({ name: "flagNote", title: "Flag Note", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "priceApprox",
      title: "Approximate Price (INR)",
      type: "number",
    }),
    defineField({
      name: "priceUnit",
      title: "Price Unit",
      type: "string",
    }),
    defineField({
      name: "showPrice",
      title: "Show Price on Site",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "moq",
      title: "Minimum Order Quantity (MOQ)",
      type: "number",
    }),
    defineField({
      name: "moqUnit",
      title: "MOQ Unit",
      type: "string",
    }),
    defineField({
      name: "flagged",
      title: "Flagged for Verification",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "flagNotes",
      title: "Verification Notes",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      of: [
        defineField({
          name: "imageItem",
          title: "Image Item",
          type: "object",
          fields: [
            defineField({ name: "src", title: "Image Source Path", type: "string" }),
            defineField({ name: "alt", title: "Alt Text", type: "string" }),
            defineField({ name: "width", title: "Width", type: "number" }),
            defineField({ name: "height", title: "Height", type: "number" }),
          ],
        }),
      ],
    }),
  ],
});
