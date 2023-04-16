import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Spacer,
  Stack,
} from "@chakra-ui/react";
import { IoMdCreate, IoMdPeople } from "react-icons/io";
import Link from "next/link";
import useAuthStore from "@/store/authStore";
import WithAuth from "@/components/withAuth";
import Sidebar from "@/components/adminSidebar";
import Header from "@/components/header";

export default WithAuth(function Admin() {
  const user = useAuthStore((state) => state.user);
  return (
    <>
      <Header />
      <Flex>
        <Sidebar
          links={[
            { href: "/admin/", label: "Home", isActive: true },
            { href: "/admin/courses", label: "View Courses" },
            { href: "/admin/courses/create", label: "Create Course" },
            {
              href: "/admin/announcements",
              label: "Post Announcements",
            },
            { href: "/admin/createUser", label: "Create a User" },
          ]}
        />
        <Container borderRadius={"10px"} mt="3.5rem" maxW="container.lg">
          <Flex align="center" justify="space-between">
            <Heading
              fontWeight="light"
              color="primary"
              fontSize="3xl"
              size="2xl"
            >
              Welcome to the Tech Optimum Staff Dashboard, {user?.name}
            </Heading>
            <Spacer />
          </Flex>
          <Box borderRadius="lg" py={6}>
            <Stack spacing={4}>
              <Flex direction="row" align="center" j>
                <Link href="/admin/courses">
                  <Button
                    leftIcon={<IoMdCreate />}
                    colorScheme="blue"
                    size="lg"
                  >
                    Manage Courses
                  </Button>
                </Link>

                {user?.role === "admin" && (
                  <Link href="/admin/createUsers">
                    <Button
                      ml="1rem"
                      leftIcon={<IoMdPeople />}
                      colorScheme="blue"
                      size="lg"
                    >
                      Create Users
                    </Button>
                  </Link>
                )}
              </Flex>
            </Stack>
          </Box>
        </Container>
      </Flex>
    </>
  );
}, "moderator");
