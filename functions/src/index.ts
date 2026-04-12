/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 1 });

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { GoogleGenerativeAI } from "@google/generative-ai";
// new package is moved to @google/genai
// it is currently not building. Not sure what's wrong with it
import { Request, Response } from "express";

export const askGemini = onRequest(
  { secrets: ["GEM_FLASH_API_KEY"] },
  async (req: Request, res: Response) => {
    try {
      const cols = Number(req.query.cols);
      const rows = Number(req.query.rows);
      const numBoards = Number(req.query.numBoards);

      if (Number.isNaN(cols) || Number.isNaN(rows) || Number.isNaN(numBoards)) {
        res.status(400).json({ error: "Invalid query data" });
        return;
      }

      if (cols > 6 || cols < 3) {
        res.status(400).json({ error: "Bad number of cols" });
        return;
      }

      if (rows > 5 || rows < 3) {
        res.status(400).json({ error: "Bad number of rows" });
        return;
      }

      if (numBoards > 3 || numBoards < 1) {
        res.status(400).json({ error: "Bad number of boards" });
        return;
      }

      const apiKey = process.env.GEM_FLASH_API_KEY;
      if (!apiKey) {
        logger.error("Missing API key");
        res.status(500).json({ error: "Server config error" });
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          candidateCount: 1,
          temperature: 1.5,
        },
      });

      const prompt = buildPrompt(cols, rows, numBoards);
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      res.json({ result: text });
      return;
    } catch (err) {
      logger.error("askGemini error", err);
      res.status(500).json({ error: "Unknown error - 219" });
      return;
    }
  },
);

function buildPrompt(cols: number, rows: number, numBoards: number) {
  return `
You are tasked with building a JSON object used for a musical version of the game Jeopardy. You must build ${numBoards} boards with ${cols} categories, ${rows} songs per category, and one song for final jeopardy with a hint.

Although you must name a specific song to be played, much of this game's emphasis is on who the artist is. When players make their guesses to score points, they must guess the artist, so try to put emphasis on the artists when making categories and deciding difficulty.

Songs within their category must have something in common with the category. For example, if the category is West Coast Hip-Hop, one song chosen could be something like Gin and Juice by Snoop Dog, because the song's artist, Snoop Dog, is from the West Coast Hip-Hop scene. Another example could play off of a classic jeopardy category type, like "In Inconsequential", where artist's names must be made from the letters that make up "inconsequential." Examples of artists could be Selena, Queen, or Lit.

Be very creative when deciding the categories. Brainstorm categories that are novel and imaginative. Don't limit yourself to things that are predictable or closely related. Draw inspiration from classic Jeopardy categories.

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
        "name": "In Inconsequential",
        "songs": [
          {"artist": "Selena", "song": "Bidi Bidi Bom Bom"},
          {"artist": "Queen", "song": "Radio Ga Ga"},
          {"artist": "Nico", "song": "Janitor of Lunacy"}
        ]
      },
      {
        "name": "West Coast Hip-Hop",
        "songs": [
          {"artist": "Snoop Dogg", "song": "Gin and Juice"},
          {"artist": "Dr. Dre", "song": "The Watcher"},
          {"artist": "N.W.A.", "song": "Express Yourself"}
        ]
      },
      {
        "name": "In The Family",
        "songs": [
          {"artist": "Jonas Brothers", "song": "Burnin' Up"},
          {"artist": "Soccer Mommy", "song": "Circle The Drain"},
          {"artist": "Uncle Kracker", "song": "Follow Me"}
        ]
      }
    ]
  },
  "board2": {
    "categories": [
      {
        "name": "Blue Collar",
        "songs": [
          {"artist": "Sabrina Carpenter", "song": "Sue Me"},
          {"artist": "Elliott Smith", "song": "Angel in the Snow"},
          {"artist": "The Carpenters", "song": "Top of the World"}
        ]
      },
      {
        "name": "YouTubers",
        "songs": [
          {"artist": "PewDiePie", "song": "Bitch Lasagna"},
          {"artist": "Jake Paul", "song": "It's Everyday Bro"},
          {"artist": "Ludwig Ahgren", "song": "Con te partirò"}
        ]
      },
      {
        "name": "Royals",
        "songs": [
          {"artist": "Lorde", "song": "Tennis Courts"},
          {"artist": "Prince", "song": "Let's Go Crazy"},
          {"artist": "Queen", "song": "Under Pressure"}
        ]
      }
    ]
  },
  "finalJeopardy": {
    "song": "Move Along",
    "artist": "The All-American Rejects",
    "hint": "These self-proclaimed outcasts hail from the Sooner State."
  }
}
\`\`\`
`;
}

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
