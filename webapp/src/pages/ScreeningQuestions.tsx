/* ──────────────────────────────────────────────
   ScreeningQuestions.tsx — Screening Questions
   Displays questions for the selected screening
   type.
────────────────────────────────────────────── */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ScreeningQuestions.css";

/* Describes one answer option returned by the backend */
interface AnswerOption {
  label: string;
  score: number;
}

/* Describes one screening question returned by the backend */
interface ScreeningQuestion {
  testId: string;
  questionId: string;
  order: number;
  text: string;
  options: AnswerOption[];
}

function ScreeningQuestions() {
  /* Gets "anxiety" or "depression" from the URL */
  const { screeningType } = useParams();

  /* Stores the questions returned by the backend */
  const [questions, setQuestions] = useState<ScreeningQuestion[]>([]);

  /* Stores the selected score for each question */
  const [answers, setAnswers] = useState<Record<string, number>>({});

  /* Tracks whether the request is still loading */
  const [isLoading, setIsLoading] = useState(true);

  /* Stores an error message if the request fails */
  const [error, setError] = useState("");

  /* Stores the final score after submission */
  const [score, setScore] = useState<number | null>(null);

  /* Stores a validation message if questions are missing */
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    async function getQuestions() {
      try {
        /* Reset page status when the screening type changes */
        setIsLoading(true);
        setError("");
        setAnswers({});
        setScore(null);
        setSubmitError("");

        const response = await fetch(
          `https://vbp6dr69ud.execute-api.us-east-1.amazonaws.com/questions/${screeningType}`
        );

        if (!response.ok) {
          throw new Error("Could not load questions");
        }

        const data = await response.json();

        setQuestions(data.questions);
      } catch (error) {
        console.error(error);
        setError("Unable to load the screening questions.");
      } finally {
        setIsLoading(false);
      }
    }

    getQuestions();
  }, [screeningType]);

  /* Saves the selected score for one question */
  function handleAnswerChange(questionId: string, score: number) {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: score
    }));
  }

  /* Checks the answers and calculates the total score */
  function handleSubmit() {
    const answeredQuestionCount = Object.keys(answers).length;

    if (answeredQuestionCount !== questions.length) {
      setSubmitError("Please answer every question before submitting.");
      return;
    }

    const totalScore = Object.values(answers).reduce(
      (total, answerScore) => total + answerScore,
      0
    );

    setSubmitError("");
    setScore(totalScore);
  }

  /* Returns a simple severity interpretation for a score from 0 to 30 */
  function getScoreInterpretation(score: number) {
    if (score <= 4) {
      return {
        severity: "Minimal",
        description:
          "Your responses suggest very few symptoms at this time."
      };
    }

    if (score <= 9) {
      return {
        severity: "Mild",
        description:
          "Your responses suggest mild symptoms that may occasionally affect your daily life."
      };
    }

    if (score <= 14) {
      return {
        severity: "Moderate",
        description:
          "Your responses suggest moderate symptoms that may be affecting your daily activities."
      };
    }

    if (score <= 19) {
      return {
        severity: "Moderately Severe",
        description:
          "Your responses suggest symptoms that may be having a noticeable impact on your daily life."
      };
    }

    return {
      severity: "Severe",
      description:
        "Your responses suggest significant symptoms. Consider speaking with a qualified mental health professional."
    };
  }

  if (isLoading) {
    return (
      <p className="screening-test-message">
        Loading questions...
      </p>
    );
  }

  if (error) {
    return (
      <p className="screening-test-message">
        {error}
      </p>
    );
  }

  return (
    <section className="screening-test">
      <h1 className="screening-heading">
        {screeningType === "anxiety"
          ? "Anxiety Screening"
          : "Depression Screening"}
      </h1>

      <p className="screening-subtitle">
        Answer each question based on how you have felt recently.
      </p>

      {questions.map((question) => (
        <div className="question-card" key={question.questionId}>
          <h2 className="question-title">
            {question.order}. {question.text}
          </h2>

          <div className="options">
            {question.options.map((option) => (
              <label className="option" key={option.score}>
                <input
                  type="radio"
                  name={`question-${question.questionId}`}
                  value={option.score}
                  checked={
                    answers[question.questionId] === option.score
                  }
                  onChange={() =>
                    handleAnswerChange(
                      question.questionId,
                      option.score
                    )
                  }
                />

                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {submitError && (
        <p className="submit-error">
          {submitError}
        </p>
      )}

      <button
        className="submit-screening-button"
        type="button"
        onClick={handleSubmit}
      >
        Submit Screening
      </button>

      {score !== null && (
        <div className="screening-result">
          <h2>Your Screening Result</h2>

          <p className="result-score">
            {score} / 30
          </p>

          <h3>
            {getScoreInterpretation(score).severity}
            {" "}
            {screeningType === "anxiety"
                ? "Anxiety"
                : "Depression"}
          </h3>

          <p>
            {getScoreInterpretation(score).description}
          </p>

          <p className="result-disclaimer">
            This screening result is for informational purposes only and is not a medical diagnosis.
          </p>
        </div>
      )}
    </section>
  );
}

export default ScreeningQuestions;