"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Cookies from "js-cookie";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isLogin
      ? "http://localhost:8080/api/auth/login"
      : "http://localhost:8080/api/auth/register";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Handle successful login or registration
        console.log("Success:", data);

        Cookies.set("session_id", data.session_id, {
          expires: 1,
          secure: false,
          sameSite: "Strict",
        });
        Cookies.set("username", data.username, {
          expires: 1,
          secure: false,
          sameSite: "Strict",
        });
      } else {
        throw new Error(data.error || "Something went wrong");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>{isLogin ? "Login" : "Register"}</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submitButton}>
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className={styles.toggleButton}
        >
          {isLogin ? "Switch to Register" : "Switch to Login"}
        </button>
      </main>
    </div>
  );
}
