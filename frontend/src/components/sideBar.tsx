"use client";

import * as React from "react";
import Stack from "@mui/joy/Stack";
import { IconButton } from "@mui/joy";
import { usePathname, useRouter } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

interface Button {
  icon: React.ReactNode;
  label: string;
  link: string;
}

interface SidebarProps {
  buttons: Button[];
  showBackButton?: boolean;
  showSaveButton?: boolean;
  onSave?: () => void;
}

export default function SideBar({
  buttons,
  showBackButton = false,
  showSaveButton = false,
  onSave,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isMobile = useMediaQuery("(max-width:600px)");

  const handleButtonClick = (link: string) => {
    if (showBackButton) {
      const pathParts = pathname.split("/");
      pathParts.pop(); // Entfernt den letzten Teil des Pfads
      const newPath = pathParts.join("/") + link;
      router.push(newPath);
    } else {
      router.push(pathname + link);
    }
  };

  if (isMobile) {
    return (
      <div
        className={"background"}
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          backgroundColor: "white",
          padding: "10px 0",
          boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
          zIndex: 1000,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: "space-evenly",
            alignItems: "center",
            paddingBottom: "10px",
          }}
        >
          {showBackButton && (
            <IconButton
              variant="soft"
              key={"back"}
              onClick={() => {
                const pathParts = pathname.split("/");
                pathParts.pop();
                const newPath = pathParts.join("/");
                router.push(newPath);
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          )}
          {showSaveButton && (
            <IconButton
              variant="soft"
              color="success"
              key={"save"}
              onClick={onSave}
            >
              <SaveRoundedIcon />
            </IconButton>
          )}
          {buttons.map((button, index) => (
            <IconButton
              variant="soft"
              key={index}
              onClick={() => {
                handleButtonClick(button.link);
              }}
            >
              {button.icon}
            </IconButton>
          ))}
        </Stack>
      </div>
    );
  }

  return (
    <div
      className={"background"}
      style={{
        height: "100vh",
        width: "fit-content",
        position: "relative",
        zIndex: 1000,
      }}
    >
      <Stack
        direction="column"
        spacing={2}
        sx={{
          justifyContent: "flex-start",
          alignItems: "flex-start",
          padding: "20px",
          paddingTop: "30px",
          scale: 1.2,
        }}
      >
        {showBackButton && (
          <IconButton
            variant="soft"
            key={0}
            onClick={() => {
              const pathParts = pathname.split("/");
              pathParts.pop();
              const newPath = pathParts.join("/");
              router.push(newPath);
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
        )}{" "}
        {showSaveButton && (
          <IconButton
            variant="soft"
            color="success"
            key={"save"}
            onClick={onSave}
          >
            <SaveRoundedIcon />
          </IconButton>
        )}
        {buttons.map((button, index) => (
          <IconButton
            variant="soft"
            key={index + 1}
            onClick={() => {
              handleButtonClick(button.link);
            }}
          >
            {button.icon}
          </IconButton>
        ))}
      </Stack>
    </div>
  );
}
