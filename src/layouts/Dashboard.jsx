import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Box } from "@material-ui/core";

export const Dashboard = ({ children, ...props }) => {
  return (
    <Box minWidth="1280px" {...props}>
      <Header />
      <Box display="flex" minHeight="calc(100vh - 100px)">
        <Sidebar />
        <Box p={4} width="calc(100% - 350px)" bgcolor="rgba(223, 223, 223, 0.2)">
          {children}
        </Box>
      </Box>
    </Box>
  );
};
