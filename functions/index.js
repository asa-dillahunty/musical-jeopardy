const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require('firebase-functions');
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.askGemini = onRequest(
  { secrets: ["GEM_FLASH_API_KEY"]}, 
  async (request, response) => {
    try {
      const cols = Number(request.query.cols);
      const rows = Number(request.query.rows);
      const numBoards = Number(request.query.numBoards);

      // if they're not numbers, or bad numbers
      if (!cols || !rows || !numBoards) throw new functions.https.HttpsError('invalid-argument', 'invalid query data');
      if (cols > 6 || cols < 3) throw new functions.https.HttpsError('invalid-argument', 'bad number of cols');
      if (rows > 5 || rows < 3) throw new functions.https.HttpsError('invalid-argument', 'bad number of rows');
      if (numBoards > 3 || numBoards < 1) throw new functions.https.HttpsError('invalid-argument', 'bad number of boards');

      const genAI = new GoogleGenerativeAI(process.env.GEM_FLASH_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", 
        generationConfig: {
          candidateCount: 1, // I'm not gonna display options to the user
          temperature: 1.5, // essentially 'randomness', with 0 being no randomness and 2 being the most allowed
        },
      });

      const prompt = buildPrompt(cols, rows, numBoards);

      const result = await model.generateContent(prompt);
      
      // logger.info("Hello logs!", {structuredData: true});
      // response.send("Hello from Firebase!");

      response.json({ result: result });
    } catch (e) {
      throw new functions.https.HttpsError('internal', 'unknown error - 219');
    }
  }
);

function buildPrompt(cols, rows, numBoards) {
	return `
You are tasked with building a JSON object used for a musical version of the game Jeopardy. You must build ${numBoards} boards with ${cols} categories, ${rows} songs per category, and one song for final jeopardy with a hint.

Although you must name a specific song to be played, much of this game's emphasis is on who the artist is. When players make their guesses to score points, they must guess the artist, so try to put emphasis on the artists when making categories and deciding difficulty.

Songs within their category must have something in common with the category. For example, if the category is West Coast Hip-Hop, one song chosen could be something like Gin and Juice by Snoop Dog, because the song's artist, Snoop Dog, is from the West Coast Hip-Hop scene. Another example is making a category called Taylor's Feats with songs by artists that are featured on other Taylor Swift songs. So for example, we could choose a song by Panic! At The Disco, because they were featured in Taylor Swift's song Me!. 

Be very creative when deciding the categories. Brainstorm categories that are novel and imaginative. Don't limit yourself to things that are predictable or closely related.

Remember
- DO NOT use any examples that I gave you
- DO NOT generate categories that are closely related to each other or to the examples provided
- DO NOT repeat songs or artists
- DO NOT select songs with over 100 million streams
- Categories should primarily describe connections between the artists

As the song's index grows, guessing the artist's identity is expected to become more difficult. This can be due to the song being by a lesser-known artist or simply a lesser-known song by the artist.

An example of the JSON object with 2 boards, 3 categories, 3 songs per category, and one final jeopardy would look something like this:
\`\`\`JSON
{
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
}
\`\`\`
`
}