import React from "react";
import { useSelector } from "react-redux";
// import { Auth } from "@psyrenpark/auth";
// import { Api } from "@psyrenpark/api";
// import { Storage } from "@psyrenpark/storage";
// import awsmobile from "./aws-exports";

import Routes from "./Routes";

import { styled } from "@material-ui/core/styles";
import { Modal, CircularProgress } from "@material-ui/core";

// Auth.setConfigure(awsmobile);
// Api.setConfigure(awsmobile);
// Storage.setConfigure(awsmobile);

const StyledModal = styled(Modal)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const App = () => {
  const reducer = useSelector((state) => state.reducer);
  return (
    <>
      <Routes />

      <StyledModal open={reducer.isLoading}>
        <CircularProgress color="primary" />
      </StyledModal>
    </>
  );
};

export default App;
