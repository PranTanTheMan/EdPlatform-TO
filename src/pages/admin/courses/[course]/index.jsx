import { useState, useEffect } from "react";
import {
  HStack,
  Heading,
  Stack,
  Flex,
  Text,
  Button,
  Spacer,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import useAuthStore from "@/store/authStore";
import withAuth from "@/components/withAuth";
import { parse } from "cookie";
import Header from "@/components/header";
import Sidebar from "@/components/adminSidebar";

export default withAuth(function CoursesPage({ course, isAuthenticated }) {
  const date = new Date(course.createdAt);
  const eDate = new Date(course.updatedAt);
  const editedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }).format(eDate);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }).format(date);

  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  if (typeof window !== "undefined") {
    if (isAuthenticated === false) {
      logout();
      router.push("/login");
    }

    if (router.isFallback) {
      return <div>Loading...</div>;
    }

    if (!course) return <div>Course not found</div>;
  }
  const handleViewCourse = (slug) => {
    router.push(`/courses/${slug}`);
  };

  const handleDeleteCourse = (slug) => {
    router.push(`/admin/courses/${slug}/delete`);
  };
  const handleNewCourse = () => {
    router.push("/admin/courses/create");
  };

  const handleEditCourse = (slug) => {
    router.push(`/admin/courses/${slug}/edit`);
  };

  const handleViewChapter = (slug) => {
    router.push(`/courses/${router.query.course}/chapter/${slug}`);
  };

  const handleEditChapter = (slug) => {
    router.push(`/admin/courses/${router.query.course}/chapter/${slug}/edit`);
  };
  const handleDeleteChapter = (slug) => {
    router.push(`/admin/courses/${router.query.course}/chapter/${slug}/delete`);
  };

  return (
    <>
      <Header />
      <Flex>
        <Sidebar
          links={[
            { href: "/admin/", label: "Home" },
            { href: "/admin/courses", label: "View Courses", isActive: true },
            { href: "/admin/courses/create", label: "Create Course" },
            {
              href: "/admin/announcements",
              label: "Post Announcements",
            },
            { href: "/admin/createUser", label: "Create a User" },
          ]}
        />
          
        <Stack w="100%" display="block" pt="20px" py="3rem" px="4rem" spacing={4}>
        <Text as="a" href="/admin/courses">Return to Courses Home</Text>
          <Heading color="primary" fontSize="5xl">
            {course.title}{" "}
          </Heading>

          <Stack
            key={course.slug}
            borderWidth="1px"
            borderColor="blue.900"
            borderRadius="md"
            padding={4}
            spacing={2}
          >
            <Flex>
              <Text color="primary" fontWeight="bold">
                {course.title}
              </Text>
              <Spacer />
              <Text color="primary">Course Length: {course.duration}</Text>
            </Flex>
            <Text color="primary">{course.description}</Text>

            <Button
              colorScheme="blue"
              onClick={() => handleViewCourse(course.slug)}
            >
              View Course
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => handleEditCourse(course.slug)}
            >
              Edit Course
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => handleDeleteCourse(course.slug)}
            >
              Delete Course
            </Button>

            {course.chapters.map((chapter) => (
              <Stack
                key={chapter.slug}
                borderWidth="1px"
                borderColor="blue.900"
                borderRadius="md"
                padding={4}
                spacing={2}
              >
                <Text color="primary" fontWeight="bold">
                  {chapter.title}
                </Text>
                <Button
                  colorScheme="blue"
                  onClick={() => handleViewChapter(chapter.slug)}
                >
                  View Chapter
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => handleEditChapter(chapter.slug)}
                >
                  Edit Chapter
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => handleDeleteChapter(chapter.slug)}
                >
                  Delete Chapter
                </Button>
              </Stack>
            ))}

            <Button
              colorScheme="blue"
              onClick={() => {
                router.push(
                  `/admin/courses/${router.query.course}/chapter/create`
                );
              }}
            >
              Add Chapter
            </Button>
          </Stack>
          <Popover>
            <PopoverTrigger>
              <Button colorScheme="blue">{course.title} Information</Button>
            </PopoverTrigger>
            <PopoverContent border="none" bg="secondary">
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                <Text color="primary">
                  The <b>{course.title}</b> course was created on{" "}
                  <b>{formattedDate}</b>
                </Text>
                <br />
                <Text color="primary">
                  The <b>{course.title}</b> was last edited on{" "}
                  <b>{editedDate}</b>
                </Text>
              </PopoverBody>
            </PopoverContent>
          </Popover>

          <Button colorScheme="blue" onClick={handleNewCourse}>
            New Course
          </Button>
        </Stack>
      </Flex>
    </>
  );
}, "moderator");

export async function getServerSideProps({ params, req }) {
  const cookies = parse(req.headers.cookie || "");

  if (!cookies.auth)
    return {
      props: {
        isAuthenticated: false,
        courses: {},
      },
    };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/courses/` + params.course,
    {
      headers: {
        Authorization: `Bearer ${cookies.auth}`,
      },
    }
  );
  const course = await res.json();

  return {
    props: {
      course,
      isAuthenticated: true,
    },
  };
}
