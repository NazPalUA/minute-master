export type SearchParams = { [key: string]: string | string[] | undefined }
export type SearchParamsPromise = Promise<SearchParams>

export type StringWithAutocompleteOptions<TOptions extends string> =
  | (string & {})
  | TOptions
