import { Params, SpotifyBaseSource } from "../../source/base.ts";
import type { DduOptions, Item, SourceOptions } from "../../deps.ts";
import { Denops } from "../../deps.ts";
import { ActionData } from "../@ddu-kinds/spotify.ts";
import {
  getCurrentUsersPlaylists,
  getSavedTracks,
  HTTPClient,
  SimplifiedPlaylist,
  SpotifyClient,
} from "https://deno.land/x/soundify@v1.1.5/mod.ts";
import { PagingObject } from "https://deno.land/x/soundify@v1.1.5/endpoints/general.types.ts";

export class Source extends SpotifyBaseSource<Params> {
  override gather(args: {
    denops: Denops;
    options: DduOptions;
    sourceOptions: SourceOptions;
    sourceParams: Params;
    input: string;
  }): ReadableStream<Item<ActionData>[]> {
    return new ReadableStream({
      async start(controller) {
        let items: Item<ActionData>[];

        const collect = async () => {
          try {
            // TODO: Replace to Enviroment variable.
            const token = Deno.readTextFileSync("token");

            const client: HTTPClient = new SpotifyClient(token);

            const user_playlists: PagingObject<SimplifiedPlaylist> =
              await getCurrentUsersPlaylists(client);

            // {
            //   word: "one",
            //   action: {
            //     text: "one text",
            //   },
            // },

            const savedTrack = await getSavedTracks(
              client,
              {},
            );

            items = savedTrack.items
              .map((item) => {
                return {
                  word: item.track.name,
                  action: {
                    id: item.track.id,
                    uri: item.track.uri,
                  },
                };
              });
          } catch (e: unknown) {
            console.error(e);
          }

          return items;
        };

        controller.enqueue(await collect());

        controller.close();
      },
    });
  }
}
