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
import styles from "../Login/index.module.css";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const Register = () => {
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
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input type="text" placeholder="Enter your name" />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input type="email" placeholder="Email address" />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
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
              </FormControl>
              <FormControl style={{ marginBottom: "20px" }}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                  />
                </InputGroup>
              </FormControl>
              <Button
                borderRadius="0.375rem"
                type="submit"
                variant="solid"
                className={styles.loginButton}
                width="full"
              >
                Register
              </Button>
            </Stack>
          </form>
        </Box>
        <Box>
          Already have an account?{" "}
          <Link className="text-primary font-semibold" href="#">
            Login In
          </Link>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Register;
