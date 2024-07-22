import {
  getPlaybackState,
  pausePlayback,
  resumePlayback,
  skipToNext,
  skipToPrevious,
  startPlayback,
} from "https://deno.land/x/soundify@v1.1.5/endpoints/mod.ts";
import { ensure, is } from "../../deps.ts";
import { type HTTPClient } from "https://deno.land/x/soundify@v1.1.5/client.ts";
import { type PlaybackState } from "https://deno.land/x/soundify@v1.1.5/mod.ts";
import { launchAuthServer, openBrowser } from "./oauth_pkce.ts";
import { delay } from "jsr:@std/async/delay";
import { getAvailableDevices } from "https://deno.land/x/soundify@v1.1.5/mod.ts";
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

  return state;
}

export async function pause(client: HTTPClient) {
  await pausePlayback(client);
}
export async function resume(
  client: HTTPClient,
  id?: string,
  context?: string,
  uris?: string[],
) {
  await resumePlayback(client, {
    device_id: id,
    context_uri: context,
    uris: uris,
  });
}

export async function toNext(client: HTTPClient) {
  await skipToNext(client);
}

export async function toPrevious(client: HTTPClient) {
  await skipToPrevious(client);
}

export async function availableDevices(client: HTTPClient) {
  return await getAvailableDevices(client);
}

export async function playbackStart(client: HTTPClient) {
  return await startPlayback(client);
}

export async function startAuth(sec = 10) {
  const server = launchAuthServer();
  await openBrowser();

  await delay(sec * 1000);

  server.shutdown();

  return Promise.resolve();
}
