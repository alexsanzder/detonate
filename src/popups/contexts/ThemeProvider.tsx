import * as React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { themeCreator } from "../themes/base";

export interface ThemeContextType {
  themeName: string;
  setThemeName(value: string): void;
}

export const ThemeContext = React.createContext<ThemeContextType>({
  themeName: "lightTheme",
  setThemeName: () => {}
});

export const ThemeProvider: React.FC = (props: React.PropsWithChildren<{}>) => {
  // Read current theme from localStorage or maybe from an api
  const curThemeName = localStorage.getItem("appTheme") || "lightTheme";

  // State to hold the selected theme name
  const [themeName, _setThemeName] = React.useState(curThemeName);

  // Get the theme object by theme name
  const theme = themeCreator(themeName);

  const setThemeName = (themeName: string): void => {
    localStorage.setItem("appTheme", themeName);
    _setThemeName(themeName);
  };

  return (
    <ThemeContext.Provider value={{ themeName, setThemeName }}>
      <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
