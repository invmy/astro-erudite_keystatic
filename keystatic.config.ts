import { config, fields, collection, component } from '@keystatic/core'
import pinyin from 'tiny-pinyin'

export default config({
  locale: 'zh-CN',
  storage: import.meta.env.PROD
    ? {
        kind: 'github',
        repo: 'invmy/astro-erudite_keystatic',
      }
    : {
        kind: 'local',
      },
  ui: {
    brand: { name: 'Astro-Erudite' },
  },

  collections: {
    Blog: collection({
      label: 'Blog',
      slugField: 'title',
      path: 'src/content/blog/*/index',
      entryLayout: 'content',
      format: { contentField: 'content' },
      columns: ['title', 'date', 'description'],
      schema: {
        date: fields.date({
          label: 'Event date',
          validation: { isRequired: true },
        }),
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
          slug: {
            label: 'slug',
            description: 'Aa-Zz 0-9 - _ . And Space are prohibited',
            generate: (str: string) => {
              const withPinyin = str.replace(/[\u4e00-\u9fa5]+/g, (match) => {
                return ` ${pinyin.convertToPinyin(match, '-', true)} `
              })
              return withPinyin
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
            },
          },
        }),
        description: fields.text({
          label: 'description',
          multiline: true,
          validation: { isRequired: true },
        }),
        image: fields.image({
          label: 'Local image',
          directory: '@/content/blog/',
        }),
        authors: fields.array(
          fields.relationship({
            label: 'Post author',
            collection: 'authors',
          }),
          {
            label: 'Authors',
            itemLabel: (props) => props.value || 'Please select an author',
          },
        ),

        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tag',
          itemLabel: (props) => props.value,
        }),
        content: fields.mdx({
          label: 'Rich text Content',
          options: {
            image: {
              directory: '@/content/blog/',
            },
          },
        }),
      },
    }),

    SubPosts: collection({
      label: 'Sub Posts',
      slugField: 'title',
      path: 'src/content/blog/**',
      entryLayout: 'content',
      format: { contentField: 'content' },
      columns: ['title', 'date', 'description'],
      schema: {
        date: fields.date({
          label: 'Event date',
          validation: { isRequired: true },
        }),
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
          slug: {
            label: 'Sub Posts Slug',
            description:
              "Aa-Zz 0-9 - _ . And Space, The slug for a sub-post must follow the main Blog slug and be separated by a slash, such as 'Blog-slug/sub-posts-slug'",
            generate: (str: string) => {
              const withPinyin = str.replace(/[\u4e00-\u9fa5]+/g, (match) => {
                return ` ${pinyin.convertToPinyin(match, '-', true)} `
              })
              return withPinyin
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
            },
          },
        }),
        Blog: fields.relationship({
          label: 'Get Blog Slug',
          description:
            'This field serves no practical purpose; it is solely for the convenience of copying the main blog folder name to create slugs for sub-posts.',
          collection: 'Blog',
        }),
        description: fields.text({
          label: 'description',
          multiline: true,
          validation: { isRequired: true },
        }),
        image: fields.image({
          label: 'Local image',
          directory: '@/content/blog/',
          publicPath: '@/content/blog/',
        }),
        authors: fields.array(
          fields.relationship({
            label: 'Post author',
            collection: 'authors',
          }),
          {
            label: 'Authors',
            itemLabel: (props) => props.value || 'Please select an author',
          },
        ),

        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tag',
          itemLabel: (props) => props.value,
        }),
        content: fields.mdx({
          label: 'Rich text Content',
          options: {
            image: {
              directory: '@/content/blog/',
              publicPath: '@/content/blog/',
            },
          },
        }),
      },
    }),

    authors: collection({
      label: 'Authors',
      slugField: 'name',
      path: 'src/content/authors/*',
      format: { contentField: 'content' },
      columns: ['pronouns', 'mail', 'bio'],
      schema: {
        name: fields.slug({
          name: { label: 'name', validation: { isRequired: true } },
        }),
        pronouns: fields.text({ label: 'pronouns' }),
        avatar: fields.text({
          label: 'avatar',
          validation: { isRequired: true },
        }),
        bio: fields.text({ label: 'bio' }),
        mail: fields.text({ label: 'mail' }),
        website: fields.url({ label: 'website' }),
        twitter: fields.url({ label: 'Twitter' }),
        github: fields.url({ label: 'GitHub' }),
        linkedin: fields.url({ label: 'Linkedin' }),
        discord: fields.url({ label: 'Discord' }),
        content: fields.emptyContent({
          extension: 'md',
        }),
      },
    }),

    projects: collection({
      label: 'Projects',
      slugField: 'name',
      path: 'src/content/projects/*',
      format: { contentField: 'content' },
      columns: ['description', 'link'],
      schema: {
        name: fields.slug({
          name: { label: 'name', validation: { isRequired: true } },
        }),
        description: fields.text({
          label: 'description',
          multiline: true,
          validation: { isRequired: true },
        }),
        tags: fields.array(
          fields.text({ label: 'Tag', validation: { isRequired: true } }),
          {
            label: 'Tag',
            itemLabel: (props) => props.value,
          },
        ),
        image: fields.image({
          label: 'Local image',
          publicPath: './',
          validation: { isRequired: true },
        }),
        link: fields.url({ label: 'Link', validation: { isRequired: true } }),
        startDate: fields.date({
          label: 'Event date',
        }),
        endDate: fields.date({
          label: 'Event date',
        }),
        content: fields.emptyContent({
          extension: 'md',
        }),
      },
    }),
  },
})
