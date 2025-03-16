"use client";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

export const useCreatePlace = (
  name: string,
  location: string,
  imgPath: string,
  users: { user_tag: string }[]
) => {
  const userTags = users.map((user) => user.user_tag);

  const result = fetch("http://localhost:8080/api/places/createPlace", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, location, imgPath, users: userTags }),
  })
    .then((res) => {
      console.log(res);
      if (!res.ok) {
        switch (res.status) {
          case 401:
            Cookies.remove("session_id");
            Cookies.remove("username");
            redirect("/");
          case 409:
            return {
              success: false,
              error:
                "Dieser Ort existiert bereits! Bitte wähle einen anderen Namen.",
            };
          default:
            return { success: false, error: `API error: ${res.status}` };
        }
      }
      return res.json();
    })
    .then((data) => {
      if (data.success) {
        Cookies.set("session_id", data.session_id, {
          expires: 1,
          secure: false,
          sameSite: "Strict",
          path: "/",
        });
        return { success: true, error: null };
      } else {
        return { success: false, error: data.error || "Unknown error" };
      }
    })
    .catch((error) => {
      return { success: false, error: error.error || "Network error" };
    });

  return result;
};
