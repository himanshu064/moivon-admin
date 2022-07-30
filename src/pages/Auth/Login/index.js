import { useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  FormControl,
  FormHelperText,
  InputRightElement,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "./index.module.css";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);

  return (
    <Flex
      flexDirection="column"
      width="100%"
      height="100vh"
      backgroundColor="gray.50"
      justifyContent="center"
      alignItems="center"
      className={styles.mainBox}
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
        // backgroundColor="whiteAlpha.900"
        // boxShadow="md"
        py="2rem"
        borderRadius="10px"
        className={styles.loginBox}
      >
        <Box minW={{ base: "90%", md: "568px" }}>
          <Stack
            className="mb-3"
            flexDir="column"
            justifyContent="center"
            alignItems="center"
          >
            <img src="/img/moivon-black.png" className="mb-3" alt="moivon" />
            <Heading className="text-primary">Welcome</Heading>
          </Stack>

          <form className={styles.formDiv}>
            <Stack spacing={4} p="2rem">
              <FormControl className="mb-3">
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input type="email" placeholder="Email address" />
                </InputGroup>
              </FormControl>
              <FormControl className="mb-3">
                <InputGroup className="mb-3">
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                  />
                  <InputRightElement width="3.5rem">
                    <Button
                      height="2rem"
                      onClick={handleShowClick}
                      className={styles.buttonEye}
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible />
                      ) : (
                        <AiOutlineEye />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormHelperText textAlign="right">
                  <Link className="text-primary-light">forgot password?</Link>
                </FormHelperText>
              </FormControl>
              <Button
                borderRadius="0.375rem"
                type="submit"
                variant="solid"
                className={styles.loginButton}
                width="full"
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
        <Box>
          New to us?{" "}
          <Link className="text-primary font-semibold" href="#">
            Sign Up
          </Link>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
