import {
  getPlaybackState,
  pausePlayback,
  resumePlayback,
  skipToNext,
  skipToPrevious,
} from "https://deno.land/x/soundify@v1.1.0/endpoints/mod.ts";
import { is } from "../../deps.ts";
import { type HTTPClient } from "https://deno.land/x/soundify@v1.1.0/client.ts";

export async function nowplaying(client: HTTPClient): Promise<unknown> {
  const nowplaying = await getPlaybackState(client);

  if (is.Null(nowplaying)) {
    return null;
  } else if (nowplaying?.item) {
    return nowplaying?.item.name;
  }
}

export async function playbackState(client: HTTPClient) {
  const state = await getPlaybackState(client);

  if (is.Null(state)) {
    return null;
  } else if (state) {
    return state;
  }
}

export async function pause(client: HTTPClient) {
  await pausePlayback(client);
}
export async function resume(client: HTTPClient) {
  await resumePlayback(client);
}

export async function toNext(client: HTTPClient) {
  await skipToNext(client);
}

export async function toPrevious(client: HTTPClient) {
  await skipToPrevious(client);
}
