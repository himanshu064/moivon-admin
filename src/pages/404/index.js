import React from "react";
import { Container, Stack, Heading, Text, Button, Box } from "@chakra-ui/react";
import { MdArrowBack } from "react-icons/md";
import { Link } from "react-router-dom";
import { APP_PATH } from "../../api/endpoints";

const Error404 = () => {
  return (
    <Container maxW={"3xl"}>
      <Stack
        as={Box}
        textAlign={"center"}
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 36 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
        >
          404 <br />
          <Text as={"span"} color={"green.400"}>
            Page Not Found
          </Text>
        </Heading>
        <Text color={"gray.500"}>
          The page you are looking for does not exist!
        </Text>
        <Stack
          direction={"column"}
          spacing={3}
          align={"center"}
          alignSelf={"center"}
          position={"relative"}
        >
          <Link to={APP_PATH.home}>
            <Button
              colorScheme={"green"}
              rounded={"full"}
              leftIcon={<MdArrowBack />}
              px={6}
              _hover={{
                bg: "green.500",
              }}
              className="primary-btn"
            >
              Back to Home
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Error404;
