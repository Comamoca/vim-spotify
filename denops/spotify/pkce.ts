// This module provide PKCE's code verifier generator , sha256 hash wrapper and strong random string generator.
// Spotify's PKCE Authorization see below link.
// https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow

import { encodeBase64Url } from "jsr:@std/encoding";

export async function PKCEverifier(
  length: number,
): Promise<{ verifier: string; codeChallenge: string }> {
  const verifier = randomString(length);
  const hashed = await sha256(verifier);

  return { verifier: verifier, codeChallenge: encodeBase64Url(hashed) };
}
export function randomString(length: number): string {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const val = crypto.getRandomValues(new Uint8Array(length));

  return val.reduce(
    (acc, x) => acc + possible[x % possible.length],
    "",
  );
}

function sha256(plain: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);

  return crypto.subtle.digest("SHA-256", data);
}
