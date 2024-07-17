// This module do OAuth 2.0 PKCe Authorization.
// Spotify's PKCE Authorization see below link.
// https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow

import { ensure, is } from "jsr:@core/unknownutil@3.18.1";
import { Hono } from "jsr:@hono/hono@4.4.13";
import { PKCEverifier, randomString } from "./pkce.ts";
import { encodeBase64 } from "jsr:@std/encoding@1.0.1";
import { assertEquals } from "jsr:@std/assert@1.0.0/equals";
import {
  Config,
  ConfigType,
  loadConfig,
  loadPluginData,
  PluginData,
  PluginDataType,
} from "./load.ts";
import { open } from "https://deno.land/x/open@v0.0.6/index.ts";
import { savePluginData } from "./load.ts";

const port = 1490;
const host_url = `http://localhost:${port}`;
const redirect_uri = new URL("/auth/callback", host_url);

const config = ConfigType.parse(await loadConfig());

const CLIENT_ID = ensure(config.client_id, is.String);
const CLIENT_SECRET = ensure(config.client_secret, is.String);

const STATE = randomString(10);

const { codeChallenge, verifier } = await PKCEverifier(64);

const app = new Hono();

app.get("/", (ctx) => {
  // TOOD: replace scope to soundify's type.
  const scope =
    "user-library-read user-read-private user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public";

  const login_url = new URL("https://accounts.spotify.com/authorize");
  login_url.search = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: scope,
    redirect_uri: redirect_uri.toString(),
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    state: STATE,
  }).toString();

  return ctx.redirect(login_url.toString());
});

app.get("/auth/callback", async (ctx) => {
  const { code, state } = ctx.req.query();
  const endpoint = new URL("https://accounts.spotify.com/api/token");

  // Status of authorization. To use at return.
  const failed = ctx.html("Authorization failed.");
  const success = ctx.html("Authorization done.");

  // Checking to authorization code stealing attack
  assertEquals(state, STATE);

  const resp = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${encodeBase64(CLIENT_ID + ":" + CLIENT_SECRET)}`,
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirect_uri.toString(),
      code_verifier: verifier,
    }).toString(),
  });

  if (resp.status == 200) {
    // Authorization success.
    const data = await resp.json();
    const { access_token, refresh_token, scope, token_type, expires_in } = data;

    // console.log(data);

    // console.log(access_token);
    // console.log(refresh_token);

    try {
      await savePluginData({
        access_token: access_token,
        refresh_token: refresh_token,
      });

      // Authorization and save token all successed.
      console.log("Token was saved.");

      return success;
    } catch {
      // Authorization success. But cant saved token.
      console.log("Sorry, token can not saved. Please retry authorization.");

      return failed;
    }
  } else {
    // Authorization failed.
    return failed;
  }
});

export const launchAuthServer = () => {
  return Deno.serve({ port: port }, app.fetch);
};

export const openBrowser = async () => {
  await open(host_url);
};
