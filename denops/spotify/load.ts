import xdg from "https://deno.land/x/xdg_portable@v10.6.0/src/mod.deno.ts";
import { join } from "jsr:@std/path@1.0.0";
import { parse } from "jsr:@std/toml@1.0.0";
import { exists } from "jsr:@std/fs@0.229.3";
import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";
import { ensureFile } from "jsr:@std/fs@0.229.3";

export const ConfigType = z.object(
  {
    client_id: z.string(),
    client_secret: z.string(),
  },
);

export type Config = z.infer<typeof ConfigType>;

export const PluginDataType = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});

export type PluginData = z.infer<typeof PluginDataType>;

const config_base_path = xdg.config();
const data_base_path = xdg.data();
const plugin_name = "vim-spotify";

const config_filename = "config.toml";
const token_filename = "token.json";

const config_path = join(config_base_path, plugin_name, token_filename);
const data_path = join(data_base_path, plugin_name, token_filename);

export async function loadConfig(): Promise<Config | null> {
  const path = join(config_base_path, plugin_name, config_filename);

  if (await exists(path)) {
    const config_file = await Deno.readTextFile(path);
    return ConfigType.parse(parse(config_file));
  } else {
    return null;
  }
}

export async function saveConfig(data: Config): Promise<void> {
  await ensureFile(config_path);
  await Deno.writeTextFile(config_path, JSON.stringify(data), {
    create: true,
  });
}

export async function loadPluginData(): Promise<PluginData | null> {
  const path = join(data_base_path, plugin_name, token_filename);
  if (await exists(path)) {
    const config_file = await Deno.readTextFile(path);
    return PluginDataType.parse(JSON.parse(config_file));
  } else {
    return null;
  }
}

export async function savePluginData(data: PluginData): Promise<void> {
  await ensureFile(data_path);
  await Deno.writeTextFile(data_path, JSON.stringify(data), {
    create: true,
  });
}
