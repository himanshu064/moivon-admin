import React from "react";
import { Flex } from "@chakra-ui/react";

const mainBox = {
  background: "linear-gradient(80deg,#eff4fe 5%,ivory 60%,#eff4fe)",
};

const AuthLayout = ({ children }) => {
  return (
    <Flex
      flexDirection="column"
      width="100%"
      height="100vh"
      backgroundColor="gray.50"
      justifyContent="center"
      alignItems="center"
      style={mainBox}
    >
      {children}
    </Flex>
  );
};

export default AuthLayout;
