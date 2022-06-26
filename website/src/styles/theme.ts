import { Components, createTheme } from "@mui/material/styles";

// Define component styles to be shared for both the light and dark themes
const components: Components | undefined = {};

// Create the light theme
export const lightTheme = createTheme({
  components,
});

// Create the dark theme
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  components,
});
