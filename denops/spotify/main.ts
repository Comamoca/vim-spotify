import { Denops, ensure, execute, is } from "../../deps.ts";
import { SpotifyClient } from "https://deno.land/x/soundify@v1.1.0/mod.ts";
import { nowplaying, pause, resume, toNext, toPrevious } from "./api.ts";
import { type HTTPClient } from "https://deno.land/x/soundify@v1.1.0/client.ts";

export async function main(denops: Denops): Promise<void> {
  console.log("Hello from vim-spotiy");
  // Setup spotify client
  const token = Deno.readTextFileSync("token");
  const client: HTTPClient = new SpotifyClient(token);

  denops.dispatcher = {
    nowplaying(): Promise<unknown> {
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

  await execute(
    denops,
    `command! -nargs=1 HelloWorldEcho echomsg denops#request('${denops.name}', 'echo', [<q-args>])`,
  );
}
