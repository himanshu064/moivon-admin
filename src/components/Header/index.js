import {
  Avatar,
  Box,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import React from "react";
import { FaBell } from "react-icons/fa";
import { FiMenu, FiSearch } from "react-icons/fi";
import { CONTENT_MARGIN_LEFT } from "../../constants";

const Header = ({ onOpen }) => {
  return (
    <Box
      ml={{
        base: 0,
        md: CONTENT_MARGIN_LEFT,
      }}
      transition=".3s ease"
    >
      <Flex
        as="header"
        align="center"
        justify="space-between"
        w="full"
        px="4"
        bg="white"
        _dark={{
          bg: "gray.800",
        }}
        borderBottomWidth="1px"
        color="inherit"
        h="14"
      >
        <IconButton
          aria-label="Menu"
          display={{
            base: "inline-flex",
            md: "none",
          }}
          onClick={onOpen}
          icon={<FiMenu />}
          size="sm"
        />
        <InputGroup
          w="96"
          display={{
            base: "none",
            md: "flex",
          }}
        >
          <InputLeftElement color="gray.500">
            <FiSearch />
          </InputLeftElement>
          <Input placeholder="Search for articles..." />
        </InputGroup>

        {/* <Flex align="center">
          <Icon color="gray.500" as={FaBell} cursor="pointer" />
          <Avatar
            ml="4"
            size="sm"
            name="anubra266"
            src="https://avatars.githubusercontent.com/u/30869823?v=4"
            cursor="pointer"
          />
        </Flex> */}
      </Flex>
    </Box>
  );
};

export default Header;
