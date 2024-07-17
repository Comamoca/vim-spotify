import { Denops, ensure, execute, is } from "../../deps.ts";
import { SpotifyClient } from "https://deno.land/x/soundify@v1.1.5/mod.ts";
import { refreshToken } from "./refresh.ts";
import {
  availableDevices,
  nowplaying,
  pause,
  playbackStart,
  playbackState,
  resume,
  startAuth,
  toNext,
  toPrevious,
} from "./api.ts";
import { type HTTPClient } from "https://deno.land/x/soundify@v1.1.5/client.ts";
import { loadPluginData, PluginDataType } from "./load.ts";

async function useClient(
  callback: (client: HTTPClient) => Promise<unknown | null | undefined>,
) {
  // Load data of token.
  const data = await loadPluginData();

  if (is.Nullish(data)) {
    // When `token.json` not found, launch server and get token.
    console.log(
      "Authentication process has not been completed. Please call `spotify#auth()` to complete the authentication process.",
    );
  }

  // Expect token is aleady got.
  const token = PluginDataType.parse(data).access_token;

  // Setup spotify client
  const client: HTTPClient = new SpotifyClient(token);

  return callback(client);
}

export async function main(denops: Denops): Promise<void> {
  console.log("Hello from vim-spotiy");

  try {
    denops.dispatcher = {
      async playbackStart() {
        return await Promise.resolve(useClient(playbackStart));
      },
      async play() {
        return await Promise.resolve();
      },
      async nowplaying() {
        return await Promise.resolve(useClient(nowplaying));
      },
      async pause() {
        return await Promise.resolve(useClient(pause));
      },
      async resume() {
        return await Promise.resolve(useClient(resume));
      },
      async playbackState() {
        return await Promise.resolve(useClient(playbackState));
      },
      async next() {
        return await Promise.resolve(useClient(toNext));
      },
      async previous() {
        return await Promise.resolve(useClient(toPrevious));
      },
      async availableDevices() {
        return await Promise.resolve(useClient(availableDevices));
      },
      async auth(sec: unknown) {
        if (is.Number(sec)) {
          return await Promise.resolve(startAuth(sec));
        } else {
          return await Promise.resolve(startAuth());
        }
      },
    };
  } catch (e) {
    // Spotify API Error
    if (e.body.error.status == 401 && e.name == "SpotifyError") {
      try {
        await refreshToken();
        console.log("Refreshed token by automatically.");
      } catch {
        console.log("Can not refreshing token. Please retry authorize.");
      }
    }
  }
}
