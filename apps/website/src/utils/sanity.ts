import groq from 'groq';
import { sanityClient } from "sanity:client";
import type { PortableTextBlock } from "@portabletext/types";
import type { ImageAsset, Slug } from "@sanity/types";

const client = sanityClient

export async function getHome(): Promise<Home> {
  return await client.fetch(
    groq`*[_type == "homepage"][0]{
      _type,
      _createdAt,
      title,
      headline,
      "imageProfile":profileImage.asset->url,
      email,
      phone
    }`
  );
}

export async function getPosts(): Promise<Post[]> {
  return await client.fetch(
    groq`*[_type == "post" && defined(slug.current)] | order(_createdAt desc)`
  );
}

export async function getPost(slug: string): Promise<Post> {
  return await client.fetch(
    groq`*[_type == "post" && slug.current == $slug][0]`,
    {
      slug,
    }
  );
}

export interface Home {
  _type: "homepage";
  _createdAt: string;
  title?: string;
  headline?: string;
  imageProfile?: string;
  email: string;
  phone: string; 
}

export interface Post {
  _type: "post";
  _createdAt: string;
  title?: string;
  slug: Slug;
  excerpt?: string;
  mainImage?: ImageAsset;
  body: PortableTextBlock[];
}
