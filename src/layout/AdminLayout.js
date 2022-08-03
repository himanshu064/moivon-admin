import React from "react";
import { Box } from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import { CONTENT_MARGIN_LEFT } from "../constants";

const AdminLayout = ({ children }) => {
  return (
    <>
      <Sidebar />
      <Box
        as="main"
        backgroundColor="#ffffff"
        p="4"
        ml={{
          base: 0,
          md: CONTENT_MARGIN_LEFT,
        }}
      >
        <Box>{children}</Box>
      </Box>
    </>
  );
};

export default AdminLayout;
