import type { DduOptions, Item, SourceOptions } from "../../deps.ts";
import { BaseSource, Denops, ensure, fn, is } from "../../deps.ts";
import { ActionData } from "../@ddu-kinds/spotify.ts";
import { loadPluginData, PluginDataType } from "../spotify/load.ts";
import { SpotifyBaseSource } from "../../base/source.ts";
import { createClient } from "../spotify/utils.ts";
import {
  getCurrentUsersPlaylists,
  HTTPClient,
  SimplifiedPlaylist,
  SpotifyClient,
} from "https://deno.land/x/soundify@v1.1.5/mod.ts";
import { PagingObject } from "https://deno.land/x/soundify@v1.1.5/endpoints/general.types.ts";

// MEMO: call ddu#start({'sources': [{'name': 'user_playlist', 'params': {}}]})

type Params = {
  userid?: string;
};

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
            const client = await createClient();
            // Setup spotify client
            const user_playlists: PagingObject<SimplifiedPlaylist> =
              await getCurrentUsersPlaylists(client);

            // {
            //   word: "one",
            //   action: {
            //     text: "one text",
            //   },
            // },

            items = user_playlists.items
              .filter((items) => items.name.length > 0)
              .map((item) => {
                return {
                  word: item.name,
                  action: {
                    id: item.id,
                    uri: item.uri,
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
