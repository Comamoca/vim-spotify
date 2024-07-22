import { Denops, ensure, execute, is } from "../../deps.ts";
// import { SpotifyClient } from "https://deno.land/x/soundify@v1.1.5/mod.ts";
import { type StartResumePlaybackBody } from "https://deno.land/x/soundify@v1.1.5/endpoints/mod.ts";
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
// import { getPlaybackState } from "https://deno.land/x/soundify@v1.1.5/endpoints/mod.ts";
// import { type HTTPClient } from "https://deno.land/x/soundify@v1.1.5/client.ts";
// import { loadPluginData, PluginDataType } from "./load.ts";
import { createClient, useClient } from "./utils.ts";

export async function main(denops: Denops): Promise<void> {
  console.log("Hello from vim-spotiy");

  denops.dispatcher = {
    async playbackStart() {
      return await Promise.resolve(useClient(playbackStart));
    },
    async play() {
      return await Promise.resolve();
      // (async () => {
      //   while (true) {
      //     await Promise.any([]);
      //
      //     const client = await createClient();
      //     const state = await playbackState(client);
      //     const isPlaying = is.Boolean(state?.is_playing);
      //
      //     console.log();
      //
      //     // When pause playback, stop polling nowplaying.
      //     if (!isPlaying) {
      //       break;
      //     }
      //   }
      // })();
    },
    async nowplaying() {
      return await Promise.resolve(useClient(nowplaying));
    },
    async pause() {
      return await Promise.resolve(useClient(pause));
    },
    async resume(id: unknown, context: unknown, uris: unknown) {
      console.log("id", id, "context", context, "uris", uris);
      return await Promise.resolve(
        useClient((client) =>
          resume(
            client,
            id = is.String(id) ? id : undefined,
            context = is.String(context) ? context : undefined,
            uris = is.ArrayOf(is.String)(uris) ? uris : undefined,
          )
        ),
      );
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
    async refresh() {
      return await Promise.resolve(refreshToken());
    },
  };
}
