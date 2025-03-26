import { defineQuery } from "next-sanity";
import { CdnFetchParamsI, cdnSanityFetch, sanityFetch } from "./live";
import { Author, Slug, Startup } from "../types";

export interface PostI extends Omit<Startup, "author"> {
  author: Author;
}

export interface Playlist {
  _id: string;
  title: string;
  slug: Slug;
  select?: PostI[] | null;
}

export type SanityFetchReturnType<T> = Omit<
  Awaited<ReturnType<typeof sanityFetch>>,
  "data"
> & { data: T };

type EndpointDefinition<
  TData extends any = any,
  TParams extends Record<string, any> = Record<string, any>,
  TransformReturnT extends any = undefined,
  CdnT extends boolean = false,
> = {
  query: (params: TParams) => string;
  transformResponse?: (
    data: CdnT extends false ? SanityFetchReturnType<TData> : Promise<TData>
  ) => TransformReturnT;
  cdn?: true | false;
};

type EndpointsDefinition<
  T extends Record<string, EndpointDefinition<any, any, any, any>> = Record<
    string,
    EndpointDefinition<any, any, any>
  >,
> = T;

type FetchParamsForEndpoint<
  T extends EndpointDefinition,
  TParams extends Record<string, any> = {},
> = T["cdn"] extends true
  ? Omit<CdnFetchParamsI<string>, "query" | "params"> & {
      params?: TParams;
    }
  : Omit<Parameters<typeof sanityFetch>[0], "query" | "params"> & {
      params?: TParams;
    };

type FetchReturnTypeForEndpoint<
  T extends EndpointDefinition,
  TData extends unknown = unknown,
> = Promise<T["cdn"] extends true ? TData : SanityFetchReturnType<TData>>;

type HookReturn<T extends EndpointDefinition> =
  T extends EndpointDefinition<
    infer TData,
    infer _TParams,
    infer TTransform,
    infer TCdn
  >
    ? TTransform extends never
      ? FetchReturnTypeForEndpoint<T, TData>
      : Promise<TTransform>
    : never;

type HookParams<T extends EndpointDefinition> =
  T extends EndpointDefinition<infer _TData, infer TParams, infer _TTransform>
    ? FetchParamsForEndpoint<T, TParams>
    : never;

interface HookProps {
  skip?: boolean;
}

type Hooks<T extends EndpointsDefinition> = {
  [K in keyof T as `use${Capitalize<string & K>}Query`]: (
    params: HookParams<T[K]>,
    props?: HookProps
  ) => HookReturn<T[K]>;
};

export const STARTUPS_QUERY =
  defineQuery(`*[_type == "startup" && defined(slug.current) && !defined($search) || title match $search || category match $search || author->name match $search ] | order(_createdAt desc) {
    _id, 
    title, 
    slug,
    _createdAt,
    author -> {
      _id, name, image, bio
    },
    views,
    description,
    category,
    image
}`);

export const STARTUP_QUERY =
  defineQuery(`*[_type == "startup" && _id == $id][0] {
    _id, 
    title, 
    slug,
    _createdAt,
    author -> {
      _id, name, username, image, bio
    },
    views,
    description,
    category,
    image,
    pitch,
}`);

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
    description,
    category,
    image
}`);

export const STARTUP_VIEWS_QUERY =
  defineQuery(`*[_type == "startup" && _id == $id][0]{
    _id, views 
  }`);

export const AUTHOR_BY_GITHUB_ID_QUERY =
  defineQuery(`*[_type == "author" && id == $id][0]{
    _id,
    id,
    name,
    username,
    email,
    image,
    bio
  }`);

export const AUTHOR_BY_ID_QUERY =
  defineQuery(`*[_type == "author" && _id == $id][0]{
    _id,
    id,
    name,
    username,
    email,
    image,
    bio
  }`);

export const PLAYLIST_BY_SLUG_QUERY =
  defineQuery(`*[_type == "playlist" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    select[] -> {
      _id,
      _createdAt,
      title,
      slug,
      author -> {
        _id,
        name,
        slug,
        image,
        bio
      },
      views,
      description,
      category,
      image,
      pitch
    }  
  }`);

export const useSanityQueryRequest = <T>({ query }: { query: string }) => {
  const defaultSanityFetch = async (
    params: Omit<Parameters<typeof sanityFetch>[0], "query">
  ) => {
    return (await sanityFetch({
      ...params,
      query: query,
    })) as SanityFetchReturnType<T>;
  };

  const withCdnSanityFetch = async (
    params: Omit<CdnFetchParamsI<string>, "query">
  ) => {
    return await cdnSanityFetch<T>({ ...params, query: query });
  };

  return {
    defaultSanityFetch,
    withCdnSanityFetch,
  };
};

export const createSanityApi = <T extends EndpointsDefinition>(
  endpoints: T
): Hooks<T> => {
  const hooks = {} as Hooks<T>;

  for (const key in endpoints) {
    const endpoint = endpoints[key];
    const hookName =
      `use${key.charAt(0).toUpperCase() + key.slice(1)}Query` as keyof Hooks<T>;

    hooks[hookName] = (async (
      params: HookParams<typeof endpoint>,
      props: HookProps = { skip: false }
    ) => {
      const { defaultSanityFetch, withCdnSanityFetch } = useSanityQueryRequest({
        query: endpoint.query(params),
      });

      if (props.skip) return;

      const request = endpoint?.cdn
        ? withCdnSanityFetch(params)
        : defaultSanityFetch(params);
      const response = (await request) as any;
      return endpoint?.transformResponse
        ? endpoint.transformResponse(response)
        : response;
    }) as Hooks<T>[typeof hookName];
  }

  return hooks;
};

const endpoints: EndpointsDefinition<{
  authorById: EndpointDefinition<Author, { id: string }, Author>;
  startupsByAuthorId: EndpointDefinition<PostI[], { id: string }, PostI[]>;
  startupsBySearch: EndpointDefinition<
    PostI[],
    { search: string | null },
    PostI[]
  >;
  startupById: EndpointDefinition<PostI, { id: string }, PostI>;
  startupViewsById: EndpointDefinition<
    {
      id: string;
      views?: number;
    },
    { id: string },
    {
      id: string;
      views?: number;
    }
  >;
  playlistBySomething: EndpointDefinition<Playlist, { slug: string }, Playlist>;
}> = {
  authorById: {
    query: () => AUTHOR_BY_ID_QUERY,
    transformResponse: (response) => response.data,
    cdn: false,
  },
  startupsByAuthorId: {
    query: () => STARTUPS_BY_AUTHOR_QUERY,
    transformResponse: (response) => response.data,
  },
  startupsBySearch: {
    query: () => STARTUPS_QUERY,
    transformResponse: (response) => response.data,
  },
  startupById: {
    query: () => STARTUP_QUERY,
    transformResponse: (response) => response.data,
  },
  startupViewsById: {
    query: () => STARTUP_VIEWS_QUERY,
    transformResponse: (response) => response.data,
  },
  playlistBySomething: {
    query: () => PLAYLIST_BY_SLUG_QUERY,
    transformResponse: (response) => response.data,
  },
} as const;

export const sanityApi = createSanityApi<typeof endpoints>(endpoints);
