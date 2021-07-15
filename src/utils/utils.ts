export const fetchSameKeyDocs = async (
  key: string,
  docScopeArr: any[]
): Promise<any[]> => {
  // Array of promises to get the documents of the same key per database
  const docPromisesArr = docScopeArr.map(async database => database.get(key))
  // Capture the result of each promise, including whether it was fulfilled or rejected
  return await Promise.allSettled(docPromisesArr)
}
