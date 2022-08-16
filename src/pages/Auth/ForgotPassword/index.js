import React, { useRef } from "react";
import {
  Stack,
  Box,
  Heading,
  FormControl,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  chakra,
} from "@chakra-ui/react";
import { FaUserAlt } from "react-icons/fa";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { NOTIFICATION_DURATION } from "../../../constants";
import { forgotPassword } from "../../../services/auth";
import { APP_PATH } from "../../../api/endpoints";

import styles from "../Login/index.module.css";
import { preparePublicFolder } from "../../../api";

const CFaUserAlt = chakra(FaUserAlt);

const validationSchema = yup.object({
  email: yup.string().email("Invalid email").required("Required"),
});

const ForgotPassword = () => {
  const toastId = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const { mutate: forgotPasswordMutation, isLoading } = useMutation(
    forgotPassword,
    {
      onSuccess: () => {
        toast.remove(toastId.current);
        const successId = toast.success(
          "An email has been sent to the account!",
          NOTIFICATION_DURATION
        );
        reset();
        setTimeout(() => {
          toast.remove(successId);
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
    }
  );

  const onForgotPassword = (data) => {
    toastId.current = toast.loading("Loging in...");
    forgotPasswordMutation(data);
  };

  return (
    <Stack
      flexDir="column"
      mb="2"
      justifyContent="center"
      alignItems="center"
      py="2rem"
      borderRadius="10px"
    >
      <Box minW={{ base: "90%", md: "568px" }}>
        <Stack
          className="mb-3"
          flexDir="column"
          justifyContent="center"
          alignItems="center"
        >
          <img
            src={preparePublicFolder("/img/moivon-black.png")}
            className="mb-3"
            alt="moivon"
          />
          <Heading className="text-primary">Forgot Password</Heading>
        </Stack>

        <form
          className={styles.formDiv}
          onSubmit={handleSubmit(onForgotPassword)}
        >
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
            <Button
              borderRadius="0.375rem"
              type="submit"
              variant="solid"
              className={styles.loginButton}
              width="full"
              disabled={(!isDirty || !isValid) && isSubmitting}
              isLoading={isLoading}
            >
              Send Reset Password Link
            </Button>
          </Stack>
        </form>
      </Box>
    </Stack>
  );
};

export default ForgotPassword;
