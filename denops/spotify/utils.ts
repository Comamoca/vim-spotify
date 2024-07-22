import { type HTTPClient } from "https://deno.land/x/soundify@v1.1.5/client.ts";
import { is } from "../../deps.ts";
import { loadPluginData, PluginDataType } from "./load.ts";
import { refreshToken } from "./refresh.ts";
import { SpotifyClient } from "https://deno.land/x/soundify@v1.1.5/mod.ts";

export async function useClient(
  callback: (client: HTTPClient) => Promise<unknown | null | undefined>,
) {
  try {
    const client = await createClient();

    return callback(client);
  } catch (e) {
    console.log("Catch");
    // Spotify API Error
    if (e.body.error.status == 401 && e.name == "SpotifyError") {
      await refreshToken();
      console.log("Refreshed token by automatically.");
    }
  }
}

export async function createClient() {
  // Load data of token.
  const data = await loadPluginData();

  if (is.Nullish(data)) {
    // When `token.json` not found, launch server and get token.
    console.log(
      "Authentication process has not been completed. Please call `spotify#auth()` to complete the authentication process.",
    );
  }

  // Expect token is aleady got.
  const token = PluginDataType.parse(data).access_token;

  // Setup spotify client
  const client: HTTPClient = new SpotifyClient(token);

  return client;
}
