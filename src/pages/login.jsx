import React, { useState } from "react";
import useAuthStore from "../store/authStore";
import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  useColorModeValue,
  Text,
  InputGroup,
  InputLeftElement,
  Heading,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { FaEnvelope } from "react-icons/fa";
import { AiFillLock } from "react-icons/ai";
import { useRouter } from "next/router";

const Login = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setEmail("");
      setPassword("");
      login(data);

      // Add this block for success toast
      toast({
        title: "Login successful",
        description: "You are now logged in.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      router.push("/");
    } else {
      // Add this block for error toast
      toast({
        title: "Login failed",
        description: data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  const formBackground = useColorModeValue("#060E17", "gray.700");

  return (
    <Stack
      backgroundColor="secondary"
      direction="column"
      spacing={6}
      align="center"
      justify="center"
      minHeight="100vh"
    >
      {isAuthenticated === false ? (
        <form>
          <Stack
            direction="column"
            spacing={4}
            px="40px"
            py="60px"
            borderRadius="lg"
            bgColor={"#0A0F24 !important"}
            backgroundColor={formBackground}
            shadow="md"
            maxWidth="sm"
            width="full"
          >
            <Heading
              color="primary"
              mb="1rem"
              as="h1"
              size="xl"
              textAlign="center"
            >
              Login
            </Heading>
            <FormControl>
              <FormLabel color="primary" htmlFor="email">
                Email:
              </FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaEnvelope} color="gray.300" />}
                />
                <Input
                  color="primary"
                  borderColor="primary"
                  type="email"
                  id="email"
                  placeholder="john@techoptimum.org"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel color="primary" htmlFor="password">
                Password:
              </FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={AiFillLock} color="gray.300" />}
                />
                <Input
                  borderColor="primary"
                  color="primary"
                  type="password"
                  id="password"
                  placeholder="********"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </InputGroup>
            </FormControl>
            <Button
              mt="20px !important"
              type="submit"
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={isLoading} // Add this line
            >
              Login
            </Button>
            <Text mt="10px" color="primary">
              Don't have an account?{" "}
              <a href="/register" style={{ color: "#fff" }}>
                Sign up
              </a>
            </Text>
          </Stack>
        </form>
      ) : (
        <Stack>
          <Text color="primary">
            You are logged in as<b> {user?.email}</b>
          </Text>
          <Button colorScheme="blue" onClick={logout}>
            Logout
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default Login;
