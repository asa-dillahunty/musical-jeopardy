// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, addDoc, doc, updateDoc, deleteDoc, getDocs, getFirestore, getDoc } from 'firebase/firestore';
import { useMutation, useQuery, useQueryClient } from "react-query";
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
	measurementId: "G-7MTJRTD0XB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const GAMES_COLLECTION = 'games';
const GAMES_QUERY_KEY = 'games_key';
const gamesCollection = collection(db, GAMES_COLLECTION);

 const createGame = async (game) => {
	console.log("creating game", game);
	const docRef = await addDoc(gamesCollection, game);
	return docRef.id;
};

export const useCreateGame = () => {
	const queryClient = useQueryClient();
	return useMutation(createGame, {
		onSuccess: () => {
			queryClient.invalidateQueries(GAMES_QUERY_KEY);
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
	return useMutation(editGame, {
		onSuccess: (id) => {
			queryClient.invalidateQueries(GAMES_QUERY_KEY);
			queryClient.invalidateQueries([GAMES_QUERY_KEY, id]);
		},
	});
};

 const deleteGame = async (id) => {
	console.log("deleting game", id);
	const gameDoc = doc(db, GAMES_COLLECTION, id);
	await deleteDoc(gameDoc);
	return id;
};

export const useDeleteGame = () => {
	const queryClient = useQueryClient();
	return useMutation(deleteGame, {
		onSuccess: (id) => {
			queryClient.invalidateQueries(GAMES_QUERY_KEY);
			queryClient.invalidateQueries([GAMES_QUERY_KEY, id]);
		},
	});
};

const fetchGame = async (id) => {
	console.log("fetching game", id);
	if (!id) return null;

	const gameDoc = doc(db, GAMES_COLLECTION, id);
	const docSnap = await getDoc(gameDoc);
	if (docSnap.exists()) {
		return { id: docSnap.id, ...docSnap.data() };
	} else {
		throw new Error('Game not found');
	}
};
  
export const useGame = (id) => {
	return useQuery([GAMES_QUERY_KEY, id], () => fetchGame(id), {
	  staleTime: 60000, // 1 minute
	  cacheTime: 300000, // 5 minutes
	});
};

const fetchGamesList = async () => {
	console.log("getting games");
	const querySnapshot = await getDocs(gamesCollection);
	const gameList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	console.log(gameList);
	return gameList;
};

export const useGamesList = () => {
	return useQuery(GAMES_QUERY_KEY, fetchGamesList, {
	  staleTime: 60000, // 1 minute
	  cacheTime: 300000, // 5 minutes
	});
};



// create session function
// join session function