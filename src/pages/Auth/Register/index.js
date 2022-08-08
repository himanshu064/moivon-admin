import { useState, useRef } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import {
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  FormControl,
  InputRightElement,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../Login/index.module.css";
import { register as onRegisterFn } from "../../../services/auth";
import { NOTIFICATION_DURATION } from "../../../constants";
import { APP_PATH } from "../../../api/endpoints";
import RouteTitle from "../../../components/RouteTitle/routeTitle";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);
const CMdEmail = chakra(MdEmail);

const validationSchema = yup.object({
  name: yup.string().required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().required("Required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const Register = () => {
  const toastId = useRef(null);
  const navigate = useNavigate();

  const { mutate: loginMutation, isLoading } = useMutation(onRegisterFn, {
    onSuccess: () => {
      toast.remove(toastId.current);
      const successId = toast.success(
        "Account registered successfully!",
        NOTIFICATION_DURATION
      );
      reset();
      setTimeout(() => {
        toast.remove(successId);
        navigate(APP_PATH.login);
      }, 3000);
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

  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid, errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const [showPassword, setShowPassword] = useState(false);
  const handleShowClick = () => setShowPassword(!showPassword);

  const onRegister = (data) => {
    toastId.current = toast.loading("Registering user...");
    loginMutation(data);
  };

  return (
    <>
      <RouteTitle title="Register" />
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
            <Heading className="text-primary">Register</Heading>
          </Stack>

          <form className={styles.formDiv} onSubmit={handleSubmit(onRegister)}>
            <Stack spacing={4} p="2rem">
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    autoFocus
                    {...register("name")}
                  />
                  <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CMdEmail fill="gray.300" size="19" />}
                  />
                  <Input
                    type="email"
                    placeholder="Email address"
                    autoComplete="new-email"
                    {...register("email")}
                  />
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
                    autoComplete="new-password"
                    placeholder="Password"
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
                    {...register("confirmPassword")}
                  />
                </InputGroup>
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
                Register
              </Button>
            </Stack>
          </form>
        </Box>
        <Box>
          Already have an account?{" "}
          <RouterLink
            to={APP_PATH.login}
            className="text-primary font-semibold"
          >
            Log In
          </RouterLink>
        </Box>
      </Stack>
    </>
  );
};

export default Register;
