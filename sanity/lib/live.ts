// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { ClientReturn, defineLive } from "next-sanity";
import { client } from "./client";
import { QueryParams } from "sanity";

export type SanityFetchReturnType<T> = Omit<
  Awaited<ReturnType<typeof sanityFetch>>,
  "data"
> & { data: T };

export interface CdnFetchParamsI<QueryString extends string> {
  query: QueryString;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
}

const baseClient = client.withConfig({
  apiVersion: "vX",
});

export const { sanityFetch, SanityLive } = defineLive({
  client: baseClient,
});

export const cdnSanityFetch = <
  T extends any,
  const QueryString extends string = string,
>({
  query,
  params = {},
  revalidate = 60, // default revalidation time in seconds
  tags = [],
}: CdnFetchParamsI<QueryString>): Promise<ClientReturn<QueryString, T>> =>
  baseClient.withConfig({ useCdn: true }).fetch(query, params, {
    next: {
      revalidate: tags.length ? false : revalidate,
      tags,
    },
  });
