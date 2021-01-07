import { createMuiTheme } from "@material-ui/core/styles";

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#003a7b",
    },
    secondary: {
      main: "#333333",
      contrastText: "#ffffff",
    },
    disabled: "#999999",

    text: {
      primary: "#000000",
      secondary: "#7d7d7d",
    },

    divider: "#707070",
  },

  overrides: {
    MuiButton: {
      contained: {
        color: "#000",
        backgroundColor: "#fff",
      },
    },
  },

  typography: {
    fontFamily: `"Noto Sans KR", "Montserrat", "Roboto", sans-serif`,
    h1: { fontWeight: "400" },
    h2: { fontWeight: "400" },
    h3: { fontWeight: "400" },
    h4: { fontWeight: "400" },
    h5: { fontWeight: "400" },
    h6: { fontWeight: "400" },
  },
});
