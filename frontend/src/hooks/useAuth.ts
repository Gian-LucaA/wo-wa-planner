import { useState } from "react";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

export const useAuth = () => {
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const authenticate = async (
    isLogin: boolean,
    username: string,
    password: string
  ) => {
    setError("");
    setInfo("");
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
        setInfo(data.message);
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
        redirect("/caravanSelection");
      } else {
        throw new Error(data.error || "Something went wrong");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return { authenticate, error, info };
};
