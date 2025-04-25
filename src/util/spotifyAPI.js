import { useAtomValue } from "jotai";
import { useQuery } from "react-query";
import { AccessToken } from "./atoms";

const clientId = "88ad68ab4d984a1d9e77d8b1377651ab";
const scopes =
  "streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state";

export function spotifyLogin() {
  const redirectUrl = window.location.origin + "/callback";
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=${encodeURIComponent(scopes)}&response_type=token`;
  window.location = authUrl;
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

async function getUserData(accessToken) {
  const response = await fetch(`https://api.spotify.com/v1/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  console.log(data);
  return data;
}

export function userDataQuery(accessToken) {
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

export async function searchTracks(query, accessToken) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await response.json();
  // if data.error
  // if data.error.message ==="The access token expired"
  console.log(data);
  return data.tracks.items;

  // // Example usage
  // searchTracks('Beatles').then(tracks => {
  // console.log(tracks);
  // });
}

export async function getSingleTrack(songTitle, artist, accessToken) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${songTitle} ${artist}&type=track&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await response.json();
  // if data.error
  // if data.error.message ==="The access token expired"
  console.log(data);
  return data.tracks.items[0];
}

// Function to play a track
export async function playTrack(trackUri, accessToken) {
  console.log("playing track: ", trackUri);
  if (window.location.hostname === "localhost") {
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

export async function getCurrentlyPlaying(accessToken) {
  console.log("getting currently playing");
  if (window.location.hostname === "localhost") {
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
    }
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

export async function pausePlayback(accessToken) {
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

export async function resumePlayback(accessToken) {
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

export async function transferPlayback(accessToken, deviceID) {
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
