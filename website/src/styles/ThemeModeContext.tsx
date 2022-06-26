import { PaletteMode } from "@mui/material";
import React from "react";

// Define a TypeScript Type for the ThemeModeContext
export declare type ThemeModeContextType = {
  toggleThemeMode: () => void;
  themeMode: PaletteMode;
};

// Defines a context provider for the theme information; prevents needing to pass it via props
const ThemeModeContext = React.createContext<ThemeModeContextType>({
  toggleThemeMode: () => {},
  themeMode: "light",
});

export default ThemeModeContext;
