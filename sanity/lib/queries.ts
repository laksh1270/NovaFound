import { defineQuery } from "next-sanity";

export const STARTUPS_QUERY = defineQuery(`
  *[_type == "startup" && defined(slug.current) && !defined($search) || title match $search || category match $search || author->name match $search ] | order(_createdAt desc) {
    _id, 
    title, 
    slug, 
    _createdAt,
    author -> {
      _id, 
      name, 
      image, 
      bio
    },
    views, 
    description, 
    image,
    startupType,
    contactInfo
  }
`);

export const STARTUPS_FILTERED_QUERY = defineQuery(`
  *[_type == "startup" && defined(slug.current)
    && (!defined($search) || title match $search || category match $search || author->name match $search)
    && (!defined($startupType) || startupType == $startupType || startupType == "both")
  ] | order(${
  // This is a static template; dynamic ordering is handled in the component
  "_createdAt"
  } desc) {
    _id, 
    title, 
    slug, 
    _createdAt,
    author -> {
      _id, 
      name, 
      image, 
      bio
    },
    views, 
    description, 
    image,
    startupType,
    contactInfo
  }
`);

export const STARTUPS_BY_ID_QUERY = defineQuery(`
  *[_type == "startup" && _id == $id][0] {
    _id,
    title,
    slug,
    _createdAt,
    author->{
      _id,
      name,
      username,
      image,
      bio
    },
    views,
    description,
    category,
    image,
    pitch,
    startupType,
    contactInfo
  }
`);

export const STARTUP_VIEWS_QUERY = defineQuery(`
  *[_type == "startup" && _id == $id][0] {
    _id,
    views
  }
`);

export const AUTHOR_BY_GITHUB_ID_QUERY = defineQuery(`
  *[_type == "author" && id == $id][0]{
    _id,
    name,
    username,
    email,
    image,
    bio
  }
`)

export const AUTHOR_BY_ID_QUERY = defineQuery(`
  *[_type == "author" && _id == $id][0]{
    _id,
    name,
    username,
    email,
    image,
    bio
  }
`)

export const STARTUPS_BY_AUTHOR_QUERY =
  defineQuery(`*[_type == "startup" && author._ref == $id] | order(_createdAt desc) {
  _id, 
  title, 
  slug,
  _createdAt,
  author -> {
    _id, name, image, bio
  }, 
  views,
  category,
  image,
  startupType,
  contactInfo
}`);

// Comments queries
export const COMMENTS_BY_STARTUP_QUERY = defineQuery(`
  *[_type == "comment" && startup._ref == $startupId && !defined(parentComment)] | order(_createdAt asc) {
    _id,
    content,
    _createdAt,
    author -> {
      _id,
      name,
      image,
      username
    },
    "replies": *[_type == "comment" && parentComment._ref == ^._id] | order(_createdAt asc) {
      _id,
      content,
      _createdAt,
      author -> {
        _id,
        name,
        image,
        username
      }
    }
  }
`);

// Saved startups queries
export const SAVED_STARTUPS_QUERY = defineQuery(`
  *[_type == "savedStartup" && author._ref == $authorId] | order(_createdAt desc) {
    _id,
    startup -> {
      _id,
      title,
      slug,
      _createdAt,
      author -> { _id, name, image, bio },
      views,
      description,
      category,
      image,
      startupType,
      contactInfo
    }
  }
`);

export const ALL_CATEGORIES_QUERY = defineQuery(`
  array::unique(*[_type == "startup" && defined(slug.current) && defined(category)].category)
`);

export const ADMIN_CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] | order(name asc) {
    _id,
    name
  }
`);

export const IS_STARTUP_SAVED_QUERY = defineQuery(`
  *[_type == "savedStartup" && author._ref == $authorId && startup._ref == $startupId][0] {
    _id
  }
`);
