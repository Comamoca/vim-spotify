import { Denops, ensure, execute, is, isNullish } from "../../deps.ts";
import { SpotifyClient } from "https://deno.land/x/soundify@v1.1.5/mod.ts";
import {
  nowplaying,
  pause,
  resume,
  startAuth,
  toNext,
  toPrevious,
} from "./api.ts";
import { type HTTPClient } from "https://deno.land/x/soundify@v1.1.5/client.ts";
import { loadPluginData, PluginDataType } from "../../load.ts";

export async function main(denops: Denops): Promise<void> {
  console.log("Hello from vim-spotiy");
  // Load data of token.
  const data = await loadPluginData();

  if (is.Nullish(data)) {
    // When `token.json` not found, launch server and get token.
    console.log("認証処理が完了してません。 認証処理を完了させてください。");

    denops.dispatcher = {
      auth() {
        return Promise.resolve(startAuth());
      },
    };
  } else {
    // Expect token is aleady got.
    const token = data.access_token;

    // Setup spotify client
    const client: HTTPClient = new SpotifyClient(token);

    const spotifyAPIFunctions = {
      nowplaying() {
        return Promise.resolve(nowplaying(client));
      },
      pause() {
        return Promise.resolve(pause(client));
      },
      resume() {
        return Promise.resolve(resume(client));
      },
      playbackState() {
        return Promise.resolve();
      },
      next() {
        return Promise.resolve(toNext(client));
      },
      previous() {
        return Promise.resolve(toPrevious(client));
      },
    };

    denops.dispatcher = {
      ...spotifyAPIFunctions,
      auth() {
        return Promise.resolve(startAuth());
      },
    };
  }
}
