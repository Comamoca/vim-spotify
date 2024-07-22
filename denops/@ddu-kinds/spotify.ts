import {
  ActionArguments,
  ActionFlags,
  Actions,
  BaseKind,
  DduItem,
} from "https://deno.land/x/ddu_vim@v4.1.1/types.ts";
import { type PlaybackState } from "https://deno.land/x/soundify@v1.1.5/mod.ts";
import { ensure, is } from "../../deps.ts";
import {
  resumePlayback,
} from "https://deno.land/x/soundify@v1.1.5/endpoints/mod.ts";
import { availableDevices, resume } from "../spotify/api.ts";
import { createClient, useClient } from "../spotify/utils.ts";
import {
  Album,
  Artist,
  classifyingSpotifyUri,
  SpotifyUriType,
  Track,
} from "../spotify/spotify_uri.ts";
import { Denops, fn } from "https://deno.land/x/ddu_vim@v4.1.1/deps.ts";
import { batch, execute, format } from "../../deps.ts";
import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";

// TODO: プレビューの実装をする

export type ActionData = z.infer<typeof ActionDataType>;

export const ActionDataType = z.object(
  {
    id: z.string(),
    uri: z.string(),
  },
);

type Params = Record<string, unknown>;

export const SpotifyActions: Actions<Params> = {
  play: async (args: { denops: Denops; items: DduItem[] }) => {
    // Play select music and playlist.
    const items = args.items;
    const uri = ActionDataType.parse(items[0].action).uri;
    const uriType = classifyingSpotifyUri(uri);


    const client = await createClient();
    const devices = await availableDevices(client);

    // get id from first device
    const id = devices[0].id;

    if (
      uriType == "album" || uriType == "artist" || uriType == "playlist" ||
      uriType == "show"
    ) {
      await resumePlayback(client, {
        device_id: ensure(id, is.String),
        context_uri: uri,
      });
    } else if (uriType == "track" || uriType == "episode") {
      await resumePlayback(client, {
        device_id: ensure(id, is.String),
        uris: [uri],
      });
    } else {
      console.log("Invalid Uri.");
    }

    return Promise.resolve(ActionFlags.None);
  },
  open: async (args: { denops: Denops; items: DduItem[] }) => {
    // Open playlist.
    const items = args.items;
    return Promise.resolve(ActionFlags.None);
  },
  show_metadata: async (args: { denops: Denops; items: DduItem[] }) => {
    // Show metadata of playlist.
    const items = args.items;
    items.map((item) => item);

    return Promise.resolve(ActionFlags.None);
  },
};

export class Kind extends BaseKind<Params> {
  override actions = SpotifyActions;

  override params(): Params {
    return {};
  }
}
