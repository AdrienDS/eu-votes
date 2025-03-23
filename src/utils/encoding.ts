// Source: https://stackoverflow.com/a/66046176
export async function bufferToBase64(buffer: Buffer) {
  // use a FileReader to generate a base64 data URI:
  const base64url: string = await new Promise(r => {
    const reader = new FileReader()
    reader.onload = () => r(reader.result as string)
    reader.readAsDataURL(new Blob([buffer]))
  });
  // remove the `data:...;base64,` part from the start
  return base64url.slice(base64url.indexOf(',') + 1);
}

export async function uint8ArrayToBase64(a: Uint8Array) {
  return bufferToBase64(Buffer.from(a));
}

/**
 * Converts a Base64-encoded string (without the data URI prefix) back into a Uint8Array.
 * This function constructs a data URI and uses the Fetch API to decode it.
 * 
 * @param base64 - The Base64 string to convert.
 * @returns A promise that resolves to a Uint8Array containing the binary data.
 */
export async function base64ToUint8Array(base64: string): Promise<Uint8Array> {
  // Create a data URI with a generic MIME type for binary data.
  const dataUrl = 'data:application/octet-stream;base64,' + base64;
  // Use fetch to decode the data URI into an ArrayBuffer.
  const response = await fetch(dataUrl);
  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
}