import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { AccessToken, AccessTokenExpiration, RefreshToken } from "./atoms";
import { useQuery } from "@tanstack/react-query";

/************ Auth Stuff ************/

const clientId = "88ad68ab4d984a1d9e77d8b1377651ab";
const scopes = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-read-currently-playing",
  "user-modify-playback-state",
].join(" ");

export const getRedirectUrl = () => window.location.origin + "/callback";

// this is pretty much taken from Spotify's website: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
async function getCodeChallenge() {
  const generateRandomString = (length: number) => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  };

  const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
  };

  const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);
  return { codeVerifier, codeChallenge };
}

export async function spotifyLogin() {
  const redirectUrl = getRedirectUrl();
  const authUrl = new URL("https://accounts.spotify.com/authorize");

  const { codeVerifier, codeChallenge } = await getCodeChallenge();

  window.localStorage.setItem("code_verifier", codeVerifier);
  const params = {
    response_type: "code",
    client_id: clientId,
    scope: scopes,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: redirectUrl,
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
}

export async function getTokenFromCode(code: string) {
  const codeVerifier = localStorage.getItem("code_verifier");
  const redirectUrl = getRedirectUrl();

  const url = "https://accounts.spotify.com/api/token";
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUrl,
      code_verifier: codeVerifier,
    }),
  };

  const body = await fetch(url, payload);
  const response = await body.json();
  if (response.error) {
    alert("Error with Spotify Auth" + response.error);
    console.log(response);
    return;
  }

  localStorage.setItem("access_token", response.access_token);
  return {
    access_token: response.access_token,
    expires_in: response.expires_in,
    refresh_token: response.refresh_token,
  };
}

// Function to get access token from URL
export function getTokenFromUrl() {
  const hash = window.location.hash.substring(1);
  const params = hash.split("&").reduce((acc, current) => {
    const [key, value] = current.split("=");
    acc[key] = value;
    return acc;
  }, {});
  return params.access_token;
}

export function useRefreshAccessToken() {
  const setAccessToken = useSetAtom(AccessToken);
  const setAccessTokenExpiration = useSetAtom(AccessTokenExpiration);
  const [refreshToken, setRefreshToken] = useAtom(RefreshToken);

  return async () => {
    const { access_token, refresh_token, expires_in } =
      await refreshAccessToken(refreshToken);
    if (access_token) {
      const expiration = Date.now() + expires_in * 1000;
      setAccessToken(access_token);
      setAccessTokenExpiration(expiration);
      setRefreshToken(refresh_token);
    }
  };
}

export async function refreshAccessToken(refreshToken: string) {
  const url = "https://accounts.spotify.com/api/token";

  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
    }),
  };
  const body = await fetch(url, payload);
  const response = await body.json();

  if (response.error) {
    console.error("error" + response.error);
    return;
  }

  return {
    access_token: response.access_token,
    refresh_token: response.refresh_token,
    expires_in: response.expires_in,
  };
}

/************ Error Messages and Handling ************/

// https://developer.spotify.com/documentation/web-api/concepts/api-calls#response-status-codes
// select error codes:
//  400: Bad Request - The request could not be understood by the server due to malformed syntax. The message body will contain more information; see Response Schema.
//  401: Unauthorized - The request requires user authentication or, if the request included authorization credentials, authorization has been refused for those credentials.
//  403: Bad OAuth request (wrong consumer key, bad nonce, expired timestamp...). Unfortunately, re-authenticating the user won't help here.
//  429: Too many requests - rate limited

const EXPIRED_TOKEN_MESSAGE = "The access token expired";
// {
//   "error": {
//     "status": 401,
//     "message": "The access token expired"
//   }
// }

export function useHandleCommonErrors() {
  const refreshToken = useRefreshAccessToken();

  async function handleCommonErrors(error: Error | null) {
    console.log("handling common errors");
    if (!error) return;

    if (error.message === EXPIRED_TOKEN_MESSAGE) {
      await refreshToken();
    }
  }

  return handleCommonErrors;
}

/************ User Data ************/

async function getUserData(accessToken: string) {
  const response = await fetch(`https://api.spotify.com/v1/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  console.log(data);
  return data;
}

export function userDataQuery(accessToken: string) {
  const isEnabled = accessToken !== null && accessToken !== "";
  return {
    queryKey: ["userId"],
    queryFn: async () => getUserData(accessToken),
    enabled: isEnabled,
  };
}

export function useUserData() {
  const token = useAtomValue(AccessToken);
  const { data: userData } = useQuery(userDataQuery(token));
  return userData;
}

export function useUserId() {
  const userData = useUserData();
  if (userData) return userData.id;
  else return userData;
}

export function useUserImgUrl() {
  const userData = useUserData();
  if (userData && userData.images?.[0]?.url) return userData.images[0].url;
  else return userData;
}

/************ Search Stuff ************/

export function useSearchTracks() {
  const token = useAtomValue(AccessToken);

  return (query: string) => {
    return useQuery({
      queryKey: ["track_query", query],
      queryFn: () => searchTracksQuery({ query, token }),
      enabled: Boolean(query && query !== ""),
      staleTime: Infinity, // these should never expire
    });
  };
}

async function searchTracksQuery({
  query,
  token,
}: {
  query: string;
  token: string;
}) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const data = await response.json();
  // if data.error
  // if data.error.message ==="The access token expired"
  console.log(data);
  return data.tracks.items;
}

export async function getSingleTrack(
  songTitle: string,
  artist: string,
  accessToken: string,
) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${songTitle} ${artist}&type=track&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const data = await response.json();
  // if data.error
  // if data.error.message ==="The access token expired"
  console.log(data);
  return data.tracks.items[0];
}

/************ Control Playback ************/

// Function to play a track
export async function playTrack(trackUri: string, accessToken: string) {
  console.log("playing track: ", trackUri);
  if (window.location.hostname === "127.0.0.1") {
    console.log("NOT");
    return;
  }

  const response = await fetch(`https://api.spotify.com/v1/me/player/play`, {
    method: "PUT",
    body: JSON.stringify({ uris: [trackUri] }),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  // maybe check for error ?
  return response.ok;
}

export async function getCurrentlyPlaying(accessToken: string) {
  console.log("getting currently playing");
  if (window.location.hostname === "127.0.0.1") {
    console.log("NOT");
    return null;
  }
  // https://developer.spotify.com/documentation/web-api/reference/get-the-users-currently-playing-track
  const response = await fetch(
    `https://api.spotify.com/v1/me/player/currently-playing`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  if (response.status === 204) {
    // nothing is currently playing
    return null;
  }
  console.log(response);
  const data = await response.json();
  // if data.error
  // if data.error.message ==="The access token expired"
  console.log(data);

  // useful items:
  //	"timestamp": 0,
  //	"progress_ms": 0,
  //	"is_playing": false,
  //	"item"

  return data;
}

export async function pausePlayback(accessToken: string) {
  console.log("calling pause function");
  const response = await fetch(`https://api.spotify.com/v1/me/player/pause`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  // maybe check for error ?
  return response.ok;
}

export async function resumePlayback(accessToken: string) {
  console.log("calling resume function");
  const response = await fetch(`https://api.spotify.com/v1/me/player/play`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  // maybe check for error ?
  return response.ok;
}

export async function transferPlayback(accessToken: string, deviceID: string) {
  console.log("transferring playback", deviceID);
  const response = await fetch(`https://api.spotify.com/v1/me/player`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      device_ids: [deviceID],
    }),
  });
  // maybe check for error ?
  return response.ok;
}
