import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";
import ThemeModeContext from "./ThemeModeContext";

// Define a common UI component to toggle the theme mode
const ThemeModeToggleButton: React.FunctionComponent = () => {
  return (
    <ThemeModeContext.Consumer>
      {({ themeMode, toggleThemeMode }) => (
        <IconButton
          size="large"
          aria-label="Toggle light/dark theme"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={toggleThemeMode}
          color="inherit"
        >
          {themeMode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      )}
    </ThemeModeContext.Consumer>
  );
};

export default ThemeModeToggleButton;
