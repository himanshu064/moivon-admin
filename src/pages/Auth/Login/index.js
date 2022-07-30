import { useState, useRef } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
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
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { FaUserAlt, FaLock } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "./index.module.css";
import { NOTIFICATION_DURATION } from "../../../constants";
import { login } from "../../../services/auth";
import { APP_PATH } from "../../../api/endpoints";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const validationSchema = yup.object({
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().required("Required"),
});

const Login = () => {
  const toastId = useRef(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleShowClick = () => setShowPassword(!showPassword);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const { mutate: loginMutation, isLoading } = useMutation(login, {
    onSuccess: () => {
      toast.remove(toastId.current);
      const successId = toast.success("Login success!", NOTIFICATION_DURATION);
      reset();
      setTimeout(() => {
        toast.remove(successId);
        navigate(APP_PATH.home);
      }, 500);
    },
    onError: (error) => {
      toast.remove(toastId.current);
      const err = error?.response?.data?.error;
      if (Array.isArray(err)) {
        const [originalError] = Object.values(err?.[0]);
        toast.error(originalError, NOTIFICATION_DURATION);
      } else if (typeof err === "string") {
        toast.error(err, NOTIFICATION_DURATION);
      } else {
        toast.error("Something went wrong!");
      }
    },
  });

  const onLogin = (data) => {
    toastId.current = toast.loading("Loging in...");
    loginMutation(data);
  };

  return (
    <Stack
      flexDir="column"
      mb="2"
      justifyContent="center"
      alignItems="center"
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
          <Heading className="text-primary">Login</Heading>
        </Stack>

        <form className={styles.formDiv} onSubmit={handleSubmit(onLogin)}>
          <Stack spacing={4} p="2rem">
            <FormControl className="mb-3">
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<CFaUserAlt color="gray.300" />}
                />
                <Input
                  type="email"
                  placeholder="Email address"
                  autoFocus
                  {...register("email")}
                />
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
                  autoComplete="new-password"
                  {...register("password")}
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
                <RouterLink
                  to={APP_PATH.forgotPassword}
                  className="text-primary-light"
                >
                  forgot password?
                </RouterLink>
              </FormHelperText>
            </FormControl>
            <Button
              borderRadius="0.375rem"
              type="submit"
              variant="solid"
              className={styles.loginButton}
              width="full"
              disabled={(!isDirty || !isValid) && isSubmitting}
              isLoading={isLoading}
            >
              Login
            </Button>
          </Stack>
        </form>
      </Box>
      <Box>
        New to us?{" "}
        <RouterLink
          to={APP_PATH.register}
          className="text-primary font-semibold"
        >
          Sign Up
        </RouterLink>
      </Box>
    </Stack>
  );
};

export default Login;
