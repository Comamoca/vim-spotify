import {
  ActionArguments,
  ActionFlags,
  Actions,
  BaseKind,
  DduItem,
  PreviewContext,
} from "https://deno.land/x/ddu_vim@v4.1.1/types.ts";
import { Denops, fn } from "https://deno.land/x/ddu_vim@v4.1.1/deps.ts";
import { batch, execute, format } from "../../deps.ts";

// TODO: プレビューの実装をする

export type ActionData = {
  id: string;
  uri: string;
};

type Params = Record<string, unknown>;

export const SpotifyActions: Actions<Params> = {
  play: async (args: { denops: Denops; items: DduItem[] }) => {
    // Play select music and playlist.
    const items = args.items;

    console.log(`play: ${items[0]}`);

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
