import { defineField, defineType } from "sanity";

export const galleryItemType = defineType({
  name: "galleryItem",
  title: "Gallery Item",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "src",
      title: "Image Path",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
    }),
    defineField({
      name: "categorySlug",
      title: "Category Slug",
      type: "string",
    }),
    defineField({
      name: "productSlug",
      title: "Product Slug",
      type: "string",
    }),
  ],
});
