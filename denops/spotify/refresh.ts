import { ensure, is } from "jsr:@core/unknownutil@3.18.1";
import { encodeBase64 } from "jsr:@std/encoding@1.0.1";
import {
  ConfigType,
  loadConfig,
  loadPluginData,
  PluginDataType,
  saveConfig,
  savePluginData,
} from "./load.ts";

export async function refreshToken() {
  const endpoint = new URL("https://accounts.spotify.com/api/token");
  const config = ConfigType.parse(await loadConfig());
  const pluginData = PluginDataType.parse(await loadPluginData());

  const CLIENT_ID = config.client_id;
  const CLIENT_SECRET = config.client_secret;

  const token = pluginData.access_token;
  const rtoken = pluginData.refresh_token;

  const resp = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${encodeBase64(CLIENT_ID + ":" + CLIENT_SECRET)}`,
    },
    body: new URLSearchParams({
      "grant_type": "refresh_token",
      "refresh_token": rtoken,
      // "client_id": CLIENT_ID,
    }).toString(),
  });

  const data = await resp.json();

  console.log(data);

  const { access_token, refresh_token } = data;

  console.log(access_token);
  console.log(refresh_token);

  await savePluginData({
    access_token: access_token,
    refresh_token: refresh_token,
  });
}

// const CLIENT_ID = ensure(Deno.env.get("CLIENT_ID"), is.String);
// const CLIENT_SECRET = ensure(Deno.env.get("CLIENT_SECRET"), is.String);
// const REFRESH_TOKEN = ensure(Deno.env.get("REFRESH_TOKEN"), is.String);

// if (is.String(access_token) && access_token.length > 0) {
//   Deno.writeTextFileSync("token", access_token);
//   console.log("Update token.");
// }
//
// if (is.String(refresh_token) && refresh_token.length > 0) {
//   Deno.writeTextFileSync("refresh_token", refresh_token);
//   console.log("Update refresh token.");
// }
