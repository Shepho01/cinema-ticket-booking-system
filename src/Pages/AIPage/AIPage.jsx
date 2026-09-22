import { useState } from "react";
import "./AIPage.css";


function AIPage() {
  const [message, setMessage] =
    useState("");

  const [recommendation, setRecommendation] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prevent an empty request
    if (!message.trim()) {
      setError(
        "Tell us what kind of movie you're looking for."
      );

      return;
    }


    try {
      setLoading(true);
      setError("");
      setRecommendation("");


      const response = await fetch(
        "http://localhost:5000/ai/recommend",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message: message,
          }),
        }
      );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.error ||
          "Failed to get movie recommendation"
        );
      }


      setRecommendation(
        data.recommendation
      );

    } catch (err) {
      console.error(
        "Movie recommendation failed:",
        err
      );

      setError(
        err.message ||
        "Something went wrong"
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="ai-page">

      <section className="ai-container">

        {/* PAGE HEADING */}
        <div className="ai-heading">

          <p className="ai-label">
            SHEPH CINEMAS AI
          </p>

          <h1>
            Find Your Movie
          </h1>

          <p className="ai-description">
            Not sure what to watch?
            Tell us what you're in the mood
            for and we'll recommend something
            currently showing at Sheph Cinemas.
          </p>

        </div>


        {/* USER INPUT */}
        <form
          className="ai-form"
          onSubmit={handleSubmit}
        >

          <label
            htmlFor="movie-request"
            className="ai-form-label"
          >
            What are you in the mood for?
          </label>


          <textarea
            id="movie-request"
            className="ai-input"

            value={message}

            onChange={(event) =>
              setMessage(
                event.target.value
              )
            }

            placeholder="For example: I want something exciting with action but not too scary..."

            rows="5"

            disabled={loading}
          />


          {/* QUICK EXAMPLES */}
          <div className="ai-examples">

            <span>
              Try:
            </span>

            <button
              type="button"
              onClick={() =>
                setMessage(
                  "I want something exciting with action"
                )
              }
            >
              Action
            </button>

            <button
              type="button"
              onClick={() =>
                setMessage(
                  "I want something suitable for the whole family"
                )
              }
            >
              Family
            </button>

            <button
              type="button"
              onClick={() =>
                setMessage(
                  "I want something fun and light-hearted"
                )
              }
            >
              Feel-good
            </button>

          </div>


          {/* ERROR MESSAGE */}
          {error && (
            <p className="ai-error">
              {error}
            </p>
          )}


          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="ai-submit"
            disabled={loading}
          >
            {loading
              ? "Finding a movie..."
              : "Find My Movie"}
          </button>

        </form>


        {/* AI RESPONSE */}
        {recommendation && (
          <section className="ai-result">

            <p className="ai-result-label">
              OUR RECOMMENDATION
            </p>

            <div className="ai-response">
              {recommendation}
            </div>

          </section>
        )}

      </section>

    </main>
  );
}


export default AIPage;