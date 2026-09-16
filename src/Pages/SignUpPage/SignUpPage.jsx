import { useState } from "react";
import {
  useNavigate,
  Link,
} from "react-router-dom";

import "./SignUpPage.css";


function SignUpPage() {
  const navigate = useNavigate();

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");

      // Check passwords match
      if (password !== confirmPassword) {
        throw new Error(
          "Passwords do not match"
        );
      }

      // Call backend registration API
      const response = await fetch(
        "http://localhost:5000/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      // Backend returned an error
      if (!response.ok) {
        throw new Error(
          data.error ||
          "Failed to create account"
        );
      }

      console.log(
        "Member registered:",
        data.member
      );

      // Account successfully created
      navigate("/sign-in");

    } catch (err) {
      setError(err.message);

    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="sign-up-page">

      <form
        className="sign-up-form"
        onSubmit={handleSubmit}
      >

        <h1>CREATE ACCOUNT</h1>


        {error && (
          <p className="sign-up-error">
            {error}
          </p>
        )}


        <label htmlFor="firstName">
          First Name:
        </label>

        <input
          type="text"
          id="firstName"
          required
          value={firstName}
          onChange={(e) =>
            setFirstName(e.target.value)
          }
        />


        <label htmlFor="lastName">
          Last Name:
        </label>

        <input
          type="text"
          id="lastName"
          required
          value={lastName}
          onChange={(e) =>
            setLastName(e.target.value)
          }
        />


        <label htmlFor="email">
          Email:
        </label>

        <input
          type="email"
          id="email"
          required
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />


        <label htmlFor="password">
          Password:
        </label>

        <input
          type="password"
          id="password"
          minLength={8}
          required
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />


        <label htmlFor="confirmPassword">
          Confirm Password:
        </label>

        <input
          type="password"
          id="confirmPassword"
          minLength={8}
          required
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }
        />


        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "CREATING ACCOUNT..."
            : "SIGN UP"}
        </button>


        <p className="sign-in-link-text">
          Already have an account?{" "}

          <Link
            to="/sign-in"
            className="sign-in-link"
          >
            SIGN IN
          </Link>
        </p>

      </form>

    </div>
  );
}


export default SignUpPage;