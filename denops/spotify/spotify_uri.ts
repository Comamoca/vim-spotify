import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";

export type SpotifyUriType =
  | "album"
  | "track"
  | "artist"
  | "playlist"
  | "episode"
  | "show"
  | "none";

const ALBUM_RGX = new RegExp("spotify:album:[0-9A-Za-z]{22}");
const TRACK_RGX = new RegExp("spotify:track:[0-9A-Za-z]{22}");
const ARTIST_RGX = new RegExp("spotify:artist:[0-9A-Za-z]{22}");
const PLAYLIST_RGX = new RegExp("spotify:playlist:[0-9A-Za-z]{22}");
const EPISODE_RGX = new RegExp("spotify:episode:[0-9A-Za-z]{22}");
const SHOW_RGX = new RegExp("spotify:show:[0-9A-Za-z]{22}");
// "episode"

export const Album = z.string().regex(ALBUM_RGX);
export const Track = z.string().regex(TRACK_RGX);
export const Artist = z.string().regex(ARTIST_RGX);
export const Playlist = z.string().regex(PLAYLIST_RGX);
export const Episode = z.string().regex(EPISODE_RGX);
export const Show = z.string().regex(SHOW_RGX);

export function classifyingSpotifyUri(uri: string): SpotifyUriType {
  // classifying to spotify uri type.
  // console.log("album", Album.safeParse(uri));
  // console.log("track", Track.safeParse(uri));
  // console.log("artist", Artist.safeParse(uri));

  if (Album.safeParse(uri).success) {
    return "album";
  } else if (Track.safeParse(uri).success) {
    return "track";
  } else if (Artist.safeParse(uri).success) {
    return "artist";
  } else if (Playlist.safeParse(uri).success) {
    return "playlist";
  } else if (Episode.safeParse(uri).success) {
    return "episode";
  } else if (Show.safeParse(uri).success) {
    return "show";
  } else {
    return "none";
  }
}
