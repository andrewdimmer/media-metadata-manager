import { CssBaseline, PaletteMode, ThemeProvider } from "@mui/material";
import React, { Fragment, ReactNode } from "react";
import { darkTheme, lightTheme } from "./theme";
import ThemeModeContext, { ThemeModeContextType } from "./ThemeModeContext";

// Define the name of the local storage variable to store the theme preference in
const LOCAL_THEME_MODE_VARIABLE_NAME = "persistent-theme-mode";

// Define a TypeScript Type for the CustomThemeProvider Props
// Matches declaration of the children props from the React Fragment definition
declare type CustomThemeProviderProps = {
  children?: ReactNode | undefined;
};

// Defines the CustomThemeProvider Functional Component that should wrap the app
const CustomThemeProvider: React.FunctionComponent<
  CustomThemeProviderProps
> = ({ children }) => {
  // Loads the initial theme mode from either the local storage or user preferences
  const loadInitialThemeMode: PaletteMode = React.useMemo(() => {
    // Get the persistent the theme mode from local storage if it exists
    const persistentThemeMode = window.localStorage.getItem("theme") as
      | "light"
      | "dark"
      | null;

    // Set the theme to use the persistent theme if it exists
    if (persistentThemeMode) {
      return persistentThemeMode;
    }

    // Get the user's default theme mode from the operating system/browser
    const userPreferenceThemeMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Returns either the user's preference, or defaults to the light theme
    return userPreferenceThemeMode ? "dark" : "light";
  }, []);

  // Creates a state to keep track of the current theme mode
  const [themeMode, setThemeMode] =
    React.useState<PaletteMode>(loadInitialThemeMode);

  // Sets the theme both in the state and in local storage for next time the user vists the site.
  const setPersistentThemeMode = (mode: "light" | "dark") => {
    window.localStorage.setItem(LOCAL_THEME_MODE_VARIABLE_NAME, mode);
    setThemeMode(mode);
  };

  // Gets the current value of the theme mode context value; updates each time the themeMode changes
  const themeModeContextValue: ThemeModeContextType = React.useMemo(
    () => ({
      toggleThemeMode: () => {
        themeMode === "light"
          ? setPersistentThemeMode("dark")
          : setPersistentThemeMode("light");
      },
      themeMode,
    }),
    [themeMode]
  );

  // Sets the current theme
  const theme = React.useMemo(
    () => (themeMode === "dark" ? darkTheme : lightTheme),
    [themeMode]
  );

  return (
    <ThemeModeContext.Provider value={themeModeContextValue}>
      <ThemeProvider theme={theme}>
        <Fragment>
          <CssBaseline />
          {children}
        </Fragment>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default CustomThemeProvider;
