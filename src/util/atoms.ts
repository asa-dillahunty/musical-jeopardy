import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const AccessToken = atomWithStorage("spotify_access_token", "");
export const UserId = atom();
