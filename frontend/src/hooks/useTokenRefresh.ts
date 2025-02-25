"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function SessionChecker() {
  const [isActive, setIsActive] = useState(false);
  let sessionId = Cookies.get("session_id");

  useEffect(() => {
    let activityTimeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    const handleActivity = () => {
      setIsActive(true);
      clearTimeout(activityTimeout);
      activityTimeout = setTimeout(() => setIsActive(false), 30 * 1000); // 5 Minuten: 5 * 60 * 1000
    };

    // Attach event listeners
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);

    if (sessionId) {
      interval = setInterval(() => {
        sessionId = Cookies.get("session_id");
        const username = Cookies.get("username");
        if (isActive) {
          fetch("http://localhost:8080/api/auth/refreshToken", {
            method: "POST",
            body: JSON.stringify({
              username: username,
              session_id: sessionId,
            }),
            headers: { "Content-Type": "application/json" },
          })
            .then((res) => res.json())
            .then((data) => {
              Cookies.set("session_id", data.session_id, {
                expires: 1,
                secure: false,
                sameSite: "Strict",
              });
            })
            .catch((err) => console.error("API error:", err));
        }
      }, 1 * 60 * 1000); // 10 Minuten 10 * 60 * 1000
    }

    return () => {
      clearTimeout(activityTimeout);
      clearInterval(interval);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
    };
  }, [isActive]);

  return null;
}
