const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const pool = require("../db/pool");

const router = express.Router();


// Create Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


// POST /ai/recommend
router.post("/recommend", async (req, res) => {
  try {

    const { message } = req.body;


    // Validate user input
    if (
      !message ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        error:
          "Please enter a movie preference",
      });
    }


    // Get movies currently showing
    const { rows: movies } =
      await pool.query(
        `
        SELECT
          id,
          name,
          slug,
          classification,
          overview,
          release_status

        FROM movies

        WHERE release_status = 'now_showing'

        ORDER BY id
        `
      );


    if (movies.length === 0) {
      return res.status(404).json({
        error:
          "No movies are currently showing",
      });
    }


    // Convert database movies into text
    const movieCatalogue = movies
      .map((movie) => {
        return `
Movie ID: ${movie.id}
Name: ${movie.name}
Slug: ${movie.slug}
Classification: ${movie.classification}
Overview: ${
          movie.overview ||
          "No overview available"
        }
        `;
      })
      .join("\n");


    // Send catalogue + user request to Gemini
    const response =
  await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",

    contents: `
You are the movie recommendation assistant
for Sheph Cinemas.

Only recommend movies from the catalogue
provided below.

Do not invent movies.

Recommend a maximum of 3 movies.

For each recommendation:
- give the movie name
- briefly explain why it matches the user's request

If none match well, say so.

AVAILABLE MOVIES:

${movieCatalogue}

USER REQUEST:

${message}
    `,
  });


    // Send Gemini response back to React
    res.json({
      message:
        "Recommendation generated successfully",

      recommendation:
        response.text,
    });


  } catch (err) {

    console.error(
      "Failed to generate movie recommendation:",
      err
    );


    res.status(500).json({
      error:
        err.message ||
        "Failed to generate movie recommendation",
    });
  }
});


module.exports = router;