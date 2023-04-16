import {
  Heading,
  Stack,
  Flex,
  IconButton,
  Text,
  Button,
  Link,
  Box,
} from "@chakra-ui/react";
import { parse } from "cookie";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/router";
import withAuth from "@/components/withAuth";
import { AiOutlineUser, AiOutlineFolderOpen } from "react-icons/ai";
import Sidebar from "@/components/adminSidebar";
import Header from "@/components/header";

export default withAuth(function Courses({ courses, isAuthenticated }) {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  if (typeof window !== "undefined") {
    if (isAuthenticated === false) {
      logout();
      router.push("/login");
    }
  }
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!courses) return <div>Course not found</div>;
  return (
    <>
      <Header/>
      <Flex>
      <Sidebar
          links={[
            { href: "/admin/", label: "Home" },
            { href: "/admin/courses", label: "View Courses",isActive: true },
            { href: "/admin/courses/create", label: "Create Course" },
            {
              href: "/admin/announcements",
              label: "Post Announcements",
            },
            { href: "/admin/createUser", label: "Create a User" },
          ]}
        />
    <Box py="2rem" px="3rem">
      <Flex justifyContent="space-between" alignItems="center" mb="6">
        <Text mr="10rem" color="primary" fontSize="5xl" fontWeight="bold">
          Courses
        </Text>
        <Stack direction={{ base: "column", md: "row" }} spacing="4">
          <Link
            _hover={{ textDecoration: "none" }}
            href="/admin/courses/create"
            textDecoration="none"
          >
            <Button
              colorScheme="blue"
              fontWeight="light"
              rightIcon={<AiOutlineFolderOpen />}
              size="lg"
            >
              New Course
            </Button>
          </Link>
          <Link href="/admin/users" textDecoration="none">
            <Button
              colorScheme="blue"
              fontWeight="light"
              rightIcon={<AiOutlineUser />}
              size="lg"
            >
              Add Admin
            </Button>
          </Link>
        </Stack>
      </Flex>
      <Stack spacing="4">
        {courses.length === 0 ? (
          <Text fontSize="xl" fontWeight="bold">
            No courses found.
          </Text>
        ) : (
          courses.map((course) => (
            <Link
              key={course._id}
              href={`/admin/courses/${course.slug}`}
              textDecoration="none"
              _hover={{
                textDecoration: "none",
              }}
            >
              <Box
                p="4"
                borderWidth="1px"
                borderColor="blue.900"
                borderRadius="md"
                _hover={{ bg: "secondary" }}
              >
                <Text fontSize="2xl" fontWeight="bold">
                  {course.title}
                </Text>
                <Text>{course.instructor}</Text>
              </Box>
            </Link>
          ))
        )}
      </Stack>
    </Box>
    </Flex>
    </>
  );
}, "moderator");

export async function getServerSideProps(context) {
  const { req } = context;

  const cookies = parse(req.headers.cookie || "");

  if (!cookies.auth)
    return {
      props: {
        isAuthenticated: false,
        courses: {},
      },
    };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/courses/`,
    {
      headers: {
        Authorization: `Bearer ${cookies.auth}`,
      },
    }
  );

  const courseData = await res.json();

  return {
    props: {
      courses: Array.isArray(courseData) ? courseData : [],
      isAuthenticated: true,
    },
  };
}
