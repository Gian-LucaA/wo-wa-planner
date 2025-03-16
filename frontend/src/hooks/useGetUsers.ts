import Cookies from "js-cookie";
import { redirect } from "next/navigation";

export const useGetUsers = (userId?: string) => {
  const url = userId
    ? `http://localhost:8080/api/users/getUsers?userId=${userId}`
    : "http://localhost:8080/api/users/getUsers";

  const users = fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then((res) => {
      if (!res.ok) {
        if (res.status === 401) {
          Cookies.remove("session_id");
          Cookies.remove("username");
          redirect("/");
        }
        throw new Error("API error");
      }
      return res.json();
    })
    .then((data) => {
      return data.users;
    })
    .catch((err) => {});
  return users;
};
