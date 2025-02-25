"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { useAuth } from "../hooks/useAuth";
import { Box, Card, Divider } from "@mui/joy";
import LoginForm from "@/components/loginForm";
import RegisterForm from "@/components/registerForm";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Box className={styles.page}>
      <Card
        className={styles.card}
        variant="plain"
        sx={{
          width: {
            xs: "100vw",
            sm: 450,
          },
          height: {
            xs: "100vh",
            sm: "auto",
          },
          borderRadius: {
            xs: 0,
            sm: 10,
          },
        }}
      >
        <h1 className={styles.logo}>WoWaPlan</h1>
        <Divider style={{ margin: "5px" }} inset="none" />
        {isLogin ? (
          <LoginForm setIsLogin={setIsLogin} />
        ) : (
          <RegisterForm setIsLogin={setIsLogin} />
        )}
      </Card>
    </Box>
  );
}
