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

  props: {
    MuiButton: {
      variant: "contained",
    },
    MuiTextField: {
      variant: "outlined",
    },
    MuiSelect: {
      variant: "outlined",
    },
  },

  overrides: {
    MuiButton: {
      contained: {
        color: "#000",
        backgroundColor: "#fff",
      },
      containedSecondary: {
        borderWidth: 0,
        color: "#fff",
        backgroundColor: "#ff5252",
      },
      containedSizeLarge: {
        color: "#fff",
        backgroundColor: "#333",
      },
    },
  },

  typography: {
    fontFamily: "Roboto,'Noto Sans KR', sans-serif",

    h1: { fontWeight: "400" },
    h2: { fontWeight: "400" },
    h3: { fontWeight: "400" },
    h4: { fontWeight: "400" },
    h5: { fontWeight: "400" },
    h6: { fontWeight: "400" },
  },
});
