import { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
  Select,
  Stack,
  Heading,
} from "@chakra-ui/react";
import WithAuth from "@/components/withAuth";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/router";
import Sidebar from "@/components/adminSidebar";
import Header from "@/components/header";

const CreateUser = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const user = useAuthStore((state) => state.user);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const res = await fetch("/api/admin/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setEmail("");
      setPassword("");

      router.push("/");
    } else {
      console.log(data);
    }
  };

  return (
    <>
      <Header />
      <Flex>
        <Sidebar
          links={[
            { href: "/admin/", label: "Home" },
            { href: "/admin/courses", label: "View Courses" },
            { href: "/admin/courses/create", label: "Create Course" },
            {
              href: "/admin/announcements",
              label: "Post Announcements",
            },
            {
              href: "/admin/createUser",
              label: "Create a User",
              isActive: true,
            },
          ]}
        />
        <Stack py="2rem" px="3rem">
          <form onSubmit={handleSubmit}>
            <Stack
              w="600px"
              borderRadius={"10px"}
              bg="secondary"
              spacing={4}
              p={8}
            >
              <Heading size="lg">Create User</Heading>
              <FormControl id="name">
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </FormControl>
              <FormControl id="email">
                <FormLabel>Email</FormLabel>
                <Input
                  type="text"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </FormControl>
              <FormControl id="role">
                <FormLabel>Role</FormLabel>
                <Select
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                  <option value="moderator">moderator</option>
                </Select>
              </FormControl>
              <Button type="submit" colorScheme="blue">
                Create User
              </Button>
            </Stack>
          </form>
        </Stack>
      </Flex>
    </>
  );
};

export default WithAuth(CreateUser, "admin");
