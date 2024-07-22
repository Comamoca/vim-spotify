import { BaseSource, Denops, fn } from "../deps.ts";

export type Params = Record<never, never>;

export abstract class SpotifyBaseSource<T> extends BaseSource<Params> {
  override kind = "spotify";
  override params(): Params {
    return {};
  }
}
