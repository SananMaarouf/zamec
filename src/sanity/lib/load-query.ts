import { type QueryParams } from "sanity";
import { sanityClient } from "sanity:client";

// `defineQuery` from `groq` returns a branded string carrying the result type.
// Using a narrow signature here lets TypeGen-generated `SanityValues` flow
// through automatically once `npm run sanity:codegen` has run.
export async function loadQuery<QueryResponse>({
  query,
  params,
}: {
  query: string;
  params?: QueryParams;
}): Promise<{ data: QueryResponse }> {
  const { result } = await sanityClient.fetch<QueryResponse>(
    query,
    params ?? {},
    { filterResponse: false }
  );

  return { data: result };
}
