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

import { MdHome, MdKeyboardArrowRight, MdLogout } from "react-icons/md";

import NavItem from "../NavItem";
import Header from "../Header";
import { NavLink } from "react-router-dom";
import { deleteLocalStorage } from "../../utils/localStorage";
import { preparePublicFolder } from "../../api";

const activeStyle = {
  color: "white",
};

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
            <React.Fragment key={item.id}>
              {item.link ? (
                <NavLink
                  to={item.link}
                  // style={({ isActive }) => (isActive ? activeStyle : undefined)}
                >
                  <NavItem pl="12" py="2" icon={item?.icon}>
                    {item?.title}
                  </NavItem>
                </NavLink>
              ) : (
                <NavItem
                  pl="12"
                  py="2"
                  icon={item?.icon}
                  onClick={navItem.action}
                >
                  {item?.title}
                </NavItem>
              )}
            </React.Fragment>
          ))}
        </Collapse>
      </Box>
    );
  }
  return (
    <>
      {navItem.link ? (
        <NavLink
          to={navItem.link}
          // style={({ isActive }) => (isActive ? activeStyle : undefined)}
        >
          <NavItem key={navItem.id} icon={navItem.icon}>
            {navItem.title}
          </NavItem>
        </NavLink>
      ) : (
        <NavItem key={navItem.id} icon={navItem.icon} onClick={navItem.action}>
          {navItem.title}
        </NavItem>
      )}
    </>
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
        <img src={preparePublicFolder("/img/moivon.png")} alt="logo" />
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
  // {
  //   id: uuid(),
  //   title: "Dashboard",
  //   icon: MdHome,
  //   link: "/",
  // },
  // {
  //   id: uuid(),
  //   title: "Articles",
  //   icon: FaRss,
  // },
  // {
  //   id: uuid(),
  //   title: "Collections",
  //   icon: HiCollection,
  // },
  // {
  //   id: uuid(),
  //   title: "Checklists",
  //   icon: FaClipboardCheck,
  // },
  {
    id: uuid(),
    title: "Events Manager",
    subItems: [
      {
        id: uuid(),
        title: "All Events",
        link: "/events/list",
      },
      {
        id: uuid(),
        title: "Pending Events",
        link: "/events/list?type=pending&page=1",
      },
      {
        id: uuid(),
        title: "Approved Events",
        link: "/events/list?type=approved&page=1",
      },
    ],
  },
  {
    id: uuid(),
    title: "Hero Slider",
    subItems: [
      {
        id: uuid(),
        title: "Create Slider",
        link: "/slider/create",
      },
      {
        id: uuid(),
        title: "List Slider",
        link: "/slider/list",
      },
    ],
  },
  {
    id: uuid(),
    title: "Popular Events",
    link: "/events/popular",
  },
  {
    id: uuid(),
    title: "Upcoming Events",
    link: "/events/upcoming",
  },
  {
    id: uuid(),
    title: "News Letters",
    link: "/newsletter",
  },
  {
    id: uuid(),
    title: "Logout",
    icon: MdLogout,
    action: () => {
      deleteLocalStorage("auth");
      window.location.href = process.env.REACT_APP_PUBLIC_URL + "/";
    },
  },
];
