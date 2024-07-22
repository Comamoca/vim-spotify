import type { DduOptions, Item, SourceOptions } from "../../deps.ts";
import { BaseSource, Denops, ensure, fn, is } from "../../deps.ts";
import { ActionData } from "../@ddu-kinds/spotify.ts";
import { loadPluginData, PluginDataType } from "../spotify/load.ts";
import { SpotifyBaseSource } from "../../base/source.ts";
import { createClient } from "../spotify/utils.ts";
import {
  getCurrentUsersPlaylists,
  getShowEpisodes,
  HTTPClient,
  SimplifiedPlaylist,
  SpotifyClient,
} from "https://deno.land/x/soundify@v1.1.5/mod.ts";
import { PagingObject } from "https://deno.land/x/soundify@v1.1.5/endpoints/general.types.ts";

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
            // TODO: `show_id`を引数として受け取る
            const show_id = "3fkxQ6g3577mog02HuXZMj";

            const episodes = await getShowEpisodes(client, show_id);

            items = episodes.items.map((episode) => {
              return {
                word: episode.name,
                action: {
                  id: episode.id,
                  uri: episode.uri,
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
