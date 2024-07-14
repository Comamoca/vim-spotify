import type { DduOptions, Item, SourceOptions } from "../../deps.ts";

import { BaseSource } from "../../deps.ts";
import { Denops, fn } from "../../deps.ts";
import { ActionData } from "../@ddu-kinds/spotify.ts";
// import { ActionData } from "https://deno.land/x/ddu_kind_file@v0.7.1/file.ts";

type Params = Record<never, never>;

export class Source extends BaseSource<Params> {
  // override kind = "file";
  override kind = "spotify";

  override gather(args: {
    denops: Denops;
    options: DduOptions;
    sourceOptions: SourceOptions;
    sourceParams: Params;
    input: string;
  }): ReadableStream<Item<ActionData>[]> {
    return new ReadableStream({
      async start(controller) {
        const dir = await fn.getcwd(args.denops) as string;
        let items: Item<ActionData>[];

        const tree = async (_root: string) => {
          try {
            items = [
              {
                word: "one",
                action: {
                  text: "one text",
                },
              },
              {
                word: "two",
                action: {
                  text: "two text",
                },
              },
              {
                word: "three",
                action: {
                  text: "three text",
                },
              },
            ];
          } catch (e: unknown) {
            console.error(e);
          }

          return items;
        };

        controller.enqueue(
          await tree(dir),
        );

        controller.close();
      },
    });
  }

  override params(): Params {
    return {};
  }
}
