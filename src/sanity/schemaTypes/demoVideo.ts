import { defineField, defineType } from "sanity";

export const demoVideoType = defineType({
  name: "demoVideo",
  title: "Demo Video",
  type: "document",
  fields: [
    defineField({
      name: "id",
      title: "Video ID",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "youtubeId",
      title: "YouTube Video ID",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "thumbnailUrl",
      title: "Thumbnail URL",
      type: "url",
    }),
  ],
});
