export const readFileAsText = (
  file: File,
  signal: AbortSignal
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    signal.addEventListener('abort', () => {
      reader.abort()
      reject(new DOMException('File reading aborted', 'AbortError'))
    })

    reader.onload = event => resolve(event.target?.result as string)
    reader.onerror = error => reject(error)
    reader.readAsText(file)
  })
}

export const isJsonFile = (file: File): boolean => {
  const fileType = file.type
  const fileExtension = file.name
    .substring(file.name.lastIndexOf('.'))
    .toLowerCase()

  return fileType === 'application/json' || fileExtension === '.json'
}
