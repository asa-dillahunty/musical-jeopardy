// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  getFirestore,
  getDoc,
} from "firebase/firestore";
import { child, get, getDatabase, ref, set } from "firebase/database";
import { getFunctions } from "firebase/functions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlayerType } from "./models";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmHiJs7KXNUJVeqekiLkf92Q3jCrWwvVA",
  authDomain: "musical-jeopardy.firebaseapp.com",
  projectId: "musical-jeopardy",
  storageBucket: "musical-jeopardy.appspot.com",
  messagingSenderId: "1001376375609",
  appId: "1:1001376375609:web:27b8870bf062fede4b7ee8",
  measurementId: "G-7MTJRTD0XB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

export const functions = getFunctions(app);

const GAMES_COLLECTION = "games";
const GAMES_QUERY_KEY = "games_key";
const gamesCollection = collection(db, GAMES_COLLECTION);

export function markEvent(eventIdentifier, eventParameters, eventCallOptions) {
  logEvent(analytics, eventIdentifier, eventParameters, eventCallOptions);
}

const createGame = async (game) => {
  console.log("creating game", game);
  const docRef = await addDoc(gamesCollection, game);
  return docRef.id;
};

export const useCreateGame = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GAMES_QUERY_KEY] });
    },
  });
};

const editGame = async (updatedGame) => {
  console.log("editing game", updatedGame.id, updatedGame);
  const gameDoc = doc(db, GAMES_COLLECTION, updatedGame.id);
  await updateDoc(gameDoc, updatedGame);
  return updatedGame.id;
};

export const useUpdateGame = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editGame,
    onSuccess(_data, variables, _context) {
      queryClient.invalidateQueries({ queryKey: [GAMES_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [GAMES_QUERY_KEY, variables.id],
      });
    },
  });
};

const deleteGame = async (id: string) => {
  console.log("deleting game", id);
  const gameDoc = doc(db, GAMES_COLLECTION, id);
  await deleteDoc(gameDoc);
  return id;
};

export const useDeleteGame = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGame,
    onSuccess(_data, variables, _context) {
      queryClient.invalidateQueries({ queryKey: [GAMES_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [GAMES_QUERY_KEY, variables],
      });
    },
  });
};

const fetchGame = async (id: string) => {
  console.log("fetching game", id);
  if (!id) return null;

  const gameDoc = doc(db, GAMES_COLLECTION, id);
  const docSnap = await getDoc(gameDoc);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("Game not found");
  }
};

export const useGame = (id: string) => {
  return useQuery({
    queryKey: [GAMES_QUERY_KEY, id],
    queryFn: () => fetchGame(id),
  });
};

const fetchGamesList = async () => {
  console.log("getting games");
  const querySnapshot = await getDocs(gamesCollection);
  const gameList = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log(gameList);
  return gameList;
};

export const useGamesList = () => {
  return useQuery({ queryKey: [GAMES_QUERY_KEY], queryFn: fetchGamesList });
};

export async function writePlayersData(
  partyId: string,
  players: PlayerType[],
  numPlayers: number
) {
  console.log("writing players data");
  // ensure partyId is all caps
  partyId = partyId.toUpperCase();
  return set(ref(rtdb, `${partyId}`), {
    players,
    numPlayers,
  });
}

export async function getPlayersData(partyId: string) {
  // ensure partyId is all caps
  partyId = partyId.toUpperCase();

  const dbRef = ref(rtdb);
  const snapshot = await get(child(dbRef, `${partyId}`));
  if (snapshot.exists()) {
    console.log(snapshot.val());
    return snapshot.val();
  } else {
    console.log("No data available");
    return [];
  }
}

export function usePartyPlayersListQuery(partyId: string) {
  // ensure partyId is all caps
  partyId = partyId.toUpperCase();

  return useQuery({
    queryKey: ["rtdb_party_players_list", partyId],
    queryFn: async () => getPlayersData(partyId),
    enabled: Boolean(
      partyId !== undefined && partyId !== null && partyId !== ""
    ),
  });
}

// subscribe to something
// const dbRef = ref(getDatabase());
// get(child(dbRef, `users/${userId}`)).then((snapshot) => {
//   if (snapshot.exists()) {
//     console.log(snapshot.val());
//   } else {
//     console.log("No data available");
//   }
// }).catch((error) => {
//   console.error(error);
// });
