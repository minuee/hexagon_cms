import React from "react";
import { useSelector } from "react-redux";

import { styled } from "@material-ui/core/styles";
import { Modal, CircularProgress } from "@material-ui/core";
import Routes from "./Routes";

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
