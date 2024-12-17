import { getNewGame } from "../components/EditGame";
import { reduceSongData } from "../components/SongSelect";
import { functions } from "./firebaseAPIs";
import { storeGame } from "./session";
import { getSingleTrack } from "./spotifyAPI";
import { httpsCallable } from "firebase/functions";
import { konamiSetup } from "./konami";

const askGemini = httpsCallable(functions, "askGemini");
const callHelloWorld = httpsCallable(functions, "helloWorld");

function validateJeopardyData(data, numBoards, numCategories, numSongs) {
	try {
		if (data.finalJeopardy?.song === undefined || data.finalJeopardy?.hint === undefined) {
			throw new Error(`Final Jeopardy not included.`);
		}

		const boards = Object.keys(data);
		// we add one here for final jeopardy
		let sumBoards = 0;
	
		for (let i=0; i<boards.length; i++) {
			const boardKey = boards[i];
			if (boardKey === "finalJeopardy") continue;
			const board = data[boardKey];
			sumBoards++;
	
			if (!board.categories || !Array.isArray(board.categories)) {
				throw new Error(`Board ${boardKey} is missing 'categories' or it is not an array.`);
			}
	
			if (board.categories.length !== numCategories) {
				throw new Error(`Board ${boardKey} has ${board.categories.length} categories, expected ${numCategories}.`);
			}
	
			board.categories.forEach(category => {
				if (!category.songs || !Array.isArray(category.songs)) {
					throw new Error(`Category '${category.name}' in ${boardKey} is missing 'songs' or it is not an array.`);
				}
		
				// Check the number of songs in the category
				if (category.songs.length !== numSongs) {
					throw new Error(`Category '${category.name}' in ${boardKey} has ${category.songs.length} songs, expected ${numSongs}.`);
				}

				for (let j=0; j<category.songs.length; j++) {
					if (!category.songs[j].song) {
						throw new Error("Invalid song structure");
					}
				}
			});
		}

		if (sumBoards !== numBoards) {
			throw new Error(`Expected ${numBoards} boards, but found ${sumBoards}.`);
		}
		
		return true;
	} catch (error) {
		console.log("Validation error:", error.message);
		return false;
	}
}

function randomizeDailyDoublePositions(board) {
	if (!board.dailyDoublePositions) board.dailyDoublePositions = [];
	for (let index=0; index<board.dailyDoubles; index++) {
		// get i, get j
		let i = Math.floor(Math.random() * board.cols);
		let j = Math.floor(Math.random() * board.rows) + 1; // plus one to avoid categories
		if (isDailyDouble(i, j)) {
			// if already a daily double, try again
			index -= 1;
			continue;
		}
		 
		if (board.dailyDoublePositions[index]) 
			board.dailyDoublePositions[index] = { i, j };
		else 
			board.dailyDoublePositions.push({ i, j });
	}
}

function isDailyDouble(board, i, j) {
	if (!board) return false
	if (!board.dailyDoublePositions) return false;
	i = parseInt(i);
	// rows are strings because they are keys

	for (let index=0; index < board.dailyDoubles; index++) {
		const curr = board.dailyDoublePositions[index];
		if (curr === undefined) break;
		if (curr.i === i && curr.j === j) return true;
	}
	return false;
}

export async function createBoardFromJSON(data, numBoards, numCategories, numSongs, userID, accessToken) {
	const newGame = getNewGame();
	newGame.numBoards = numBoards;
	const songPromises = [];
	for (let i=0; i<numBoards; i++) {
		const board = newGame.boards[i];
		board.cols = numCategories;
		board.rows = numSongs;
		randomizeDailyDoublePositions(board);

		for (let j=0;j<numCategories;j++) {
			board.grid[j][0] = data[`board${i+1}`].categories[j].name;
			for (let k=0;k<numSongs;k++) {
				const currSong = data[`board${i+1}`].categories[j].songs[k].song;
				// console.log( await getSingleTrack(currSong, accessToken));
				songPromises.push(
					getSingleTrack(currSong, accessToken)
						.then(reduceSongData)
						.then((songData) => {
							board.grid[j][k + 1] = songData; // Update grid when resolved
						})
				);
				// return;
			}
		}
	}

	songPromises.push(
		getSingleTrack(data.finalJeopardy.song, accessToken)
			.then(reduceSongData)
			.then((songData) => {
				newGame.finalJeopardy = {
					category: data.finalJeopardy.hint,
					song: songData, // Update finalJeopardy song when resolved
				};
			})
	);

	await Promise.all(songPromises);

	newGame.userID = userID;
	return newGame;
}

export async function testFunc(token, userID) {
	const newGame = await createBoardFromJSON(aiExample, 2, 3, 3, userID, token);
	storeGame(newGame);
	return newGame;
}

export async function queryGemini(token, userID) {
	console.log("Querying Gemini");
	const cols = 3;
	const rows = 3;
	const numBoards = 1;
	// https://musical-jeopardy.firebaseapp.com/api/askGemini?cols=3&rows=3&numBoards=1
	const url = `https://musical-jeopardy.firebaseapp.com/api/askGemini?cols=${cols}&rows=${rows}&numBoards=${numBoards}`;
	try {
		const response = await fetch(url, {
			method: 'POST', // Use POST as required by the function
		});
	
		if (!response.ok) {
			const errorData = await response.json();
			console.error("Error response from askGemini:", errorData);
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
	
		const data = await response.json();
		console.log("Response from askGemini:", data);
		const actualText = data.result.response.candidates[0].content.parts[0].text;
		const cleanedText = actualText.replace(/```json|```/g, '').trim();
		console.log("Cleaned Text value", cleanedText);
		const gameJSON = JSON.parse(cleanedText);
		validateJeopardyData(gameJSON, numBoards, cols, rows);
		const newGame = await createBoardFromJSON(gameJSON, numBoards, cols, rows, userID, token);
		storeGame(newGame);
		return newGame;
	} catch (error) {
		console.error("Error querying askGemini:", error);
		throw error;
	}
}

const aiExample = {
	"board1": {
		"categories": [
			{
				"name": "Taylor's Feats",
				"songs": [
					{"song": "Build God, Then We'll Talk", "artist": "Panic! At The Disco"},
					{"song": "Deli", "artist": "Ice Spice"},
					{"song": "Don't", "artist": "Ed Sheeran"}
				]
			},
			{
				"name": "West Coast Hip-Hop",
				"songs": [
					{"song": "Gin and Juice", "artist": "Snoop Dogg"},
					{"song": "The Watcher", "artist": "Dr. Dre"},
					{"song": "Express Yourself", "artist": "N.W.A."}
				]
			},
			{
				"name": "In The Family",
				"songs": [
					{"song": "Burnin' Up", "artist": "Jonas Brothers"},
					{"song": "Circle The Drain", "artist": "Soccer Mommy"},
					{"song": "Follow Me", "artist": "Uncle Kracker"}
				]
			}
		]
	},
	"board2": {
		"categories": [
			{
				"name": "Blue Collar",
				"songs": [
					{"song": "Sue Me", "artist": "Sabrina Carpenter"},
					{"song": "Angel in the Snow", "artist": "Elliott Smith"},
					{"song": "Top of the World", "artist": "The Carpenters"}
				]
			},
			{
				"name": "YouTubers",
				"songs": [
					{"song": "Bitch Lasagna", "artist": "PewDiePie"},
					{"song": "It's Everyday Bro", "artist": "Jake Paul"},
					{"song": "Con te partirò", "artist": "Ludwig Ahgren"}
				]
			},
			{
				"name": "Royals",
				"songs": [
					{"song": "Tennis Courts", "artist": "Lorde"},
					{"song": "Let's Go Crazy", "artist": "Prince"},
					{"song": "Under Pressure", "artist": "Queen"}
				]
			}
		]
	},
	"finalJeopardy" : {
		"song": "Move Along", 
		"artist": "The All-American Rejects",
		"hint": "We're not in Oklahoma anymore"
	}
};

// Example JSON data (replace with actual AI output or test data)
const jeopardyData = {
	board1: {
	categories: [
		{
		name: "Soundtrack Superstars",
		songs: [
			{ song: "My Heart Will Go On", artist: "Celine Dion" },
			{ song: "Lose Yourself", artist: "Eminem" },
			{ song: "Stayin' Alive", artist: "Bee Gees" },
			{ song: "Falling Slowly", artist: "Glen Hansard & Marketa Irglova" }
		]
		},
		{
		name: "Name Drop",
		songs: [
			{ song: "Buddy Holly", artist: "Weezer" },
			{ song: "Billie Jean", artist: "Michael Jackson" },
			{ song: "Dear John", artist: "Taylor Swift" },
			{ song: "Andy Warhol", artist: "David Bowie" }
		]
		},
		{
		name: "Sibling Acts",
		songs: [
			{ song: "Everybody (Backstreet's Back)", artist: "Backstreet Boys" },
			{ song: "MMMBop", artist: "Hanson" },
			{ song: "The Wire", artist: "HAIM" },
			{ song: "I'll Be There", artist: "The Jackson 5" }
		]
		}
	]
	},
	board2: {
	categories: [
		{
		name: "Animal Instincts",
		songs: [
			{ song: "Eye of the Tiger", artist: "Survivor" },
			{ song: "Black Dog", artist: "Led Zeppelin" },
			{ song: "Crocodile Rock", artist: "Elton John" },
			{ song: "She Wolf", artist: "Shakira" }
		]
		},
		{
		name: "Cover Kings and Queens",
		songs: [
			{ song: "All Along the Watchtower", artist: "Jimi Hendrix" },
			{ song: "Respect", artist: "Aretha Franklin" },
			{ song: "Hallelujah", artist: "Jeff Buckley" },
			{ song: "I Will Always Love You", artist: "Whitney Houston" }
		]
		},
		{
		name: "Numerical Hits",
		songs: [
			{ song: "One", artist: "U2" },
			{ song: "7 Rings", artist: "Ariana Grande" },
			{ song: "99 Problems", artist: "Jay-Z" },
			{ song: "1979", artist: "Smashing Pumpkins" }
		]
		}
	]
	}, "finalJeopardy" : {
		"song": "Move Along",
		"artist": "The All-American Rejects",
		"hint": "We're not in Oklahoma anymore"
	}
};

// Validate the data
console.log("Is example 1 data valid?", validateJeopardyData(aiExample, 2, 3, 3));
console.log("Is example 2 data valid?", validateJeopardyData(jeopardyData, 2, 3, 4));