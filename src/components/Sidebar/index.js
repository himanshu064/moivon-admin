import React from "react";
import {
  Box,
  Flex,
  Text,
  Collapse,
  Icon,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
} from "@chakra-ui/react";
import { v4 as uuid } from "uuid";

import { MdHome, MdKeyboardArrowRight } from "react-icons/md";
import { FaRss, FaClipboardCheck } from "react-icons/fa";
import { HiCollection } from "react-icons/hi";

import NavItem from "../NavItem";
import Header from "../Header";
import { Link } from "react-router-dom";

const ConditionalRenderNavbar = ({ navItem }) => {
  const integrations = useDisclosure();

  if (navItem.subItems && navItem.subItems.length > 0) {
    return (
      <Box key={navItem.id}>
        <NavItem icon={navItem?.icon} onClick={integrations.onToggle}>
          {navItem?.title}
          <Icon
            as={MdKeyboardArrowRight}
            ml="auto"
            transform={integrations.isOpen && "rotate(90deg)"}
          />
        </NavItem>
        <Collapse in={integrations.isOpen}>
          {navItem.subItems.map((item) => (
            <NavItem pl="12" py="2" icon={item?.icon}>
              {item?.title}
            </NavItem>
          ))}
        </Collapse>
      </Box>
    );
  }
  return (
    <NavItem key={navItem.id} icon={navItem.icon}>
      {navItem.title}
    </NavItem>
  );
};

const SidebarOther = (props) => {
  return (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      bg="#292e40"
      _dark={{
        bg: "gray.800",
      }}
      border
      color="white"
      borderRightWidth="1px"
      w="60"
      className="customNavbar"
      {...props}
    >
      <Flex px="4" py="5" align="center">
        <img src="/img/moivon.png" alt="logo" />
        <Text
          fontSize="2xl"
          ml="2"
          color="brand.500"
          _dark={{
            color: "white",
          }}
          fontWeight="semibold"
        >
          Moivon
        </Text>
      </Flex>
      <Flex
        direction="column"
        as="nav"
        fontSize="sm"
        color="#9da2af"
        fontWeight="400"
        aria-label="Main Navigation"
      >
        {NAV_ITEMS.map((navItem) => (
          <ConditionalRenderNavbar key={navItem.id} navItem={navItem} />
        ))}
      </Flex>
    </Box>
  );
};

const Sidebar = () => {
  const sidebar = useDisclosure();

  return (
    <Box
      as="section"
      className="sticky-section"
      bg="gray.50"
      _dark={{
        bg: "gray.700",
      }}
    >
      <SidebarOther
        display={{
          base: "none",
          md: "unset",
        }}
      />
      <Drawer
        isOpen={sidebar.isOpen}
        onClose={sidebar.onClose}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent>
          <SidebarOther w="full" borderRight="none" />
        </DrawerContent>
      </Drawer>
      <Header onOpen={sidebar.onOpen} />
    </Box>
  );
};

export default Sidebar;

const NAV_ITEMS = [
  {
    id: uuid(),
    title: "Home",
    icon: MdHome,
  },
  {
    id: uuid(),
    title: "Articles",
    icon: FaRss,
  },
  {
    id: uuid(),
    title: "Collections",
    icon: HiCollection,
  },
  {
    id: uuid(),
    title: "Checklists",
    icon: FaClipboardCheck,
  },
  {
    id: uuid(),
    title: "Events Manager",
    subItems: [
      {
        id: uuid(),
        title: "Create New",
        link: "/events/new",
      },
      {
        id: uuid(),
        title: "Slack",
      },
      {
        id: uuid(),
        title: "Zapier",
      },
    ],
  },
  {
    id: uuid(),
    title: "Integrations",
    subItems: [
      {
        id: uuid(),
        title: "Shopify",
      },
      {
        id: uuid(),
        title: "Slack",
      },
      {
        id: uuid(),
        title: "Zapier",
      },
    ],
  },
  {
    id: uuid(),
    title: "Settings",
    subItems: [
      {
        id: uuid(),
        title: "Profile",
      },
      {
        id: uuid(),
        title: "Logout",
      },
    ],
  },
];
