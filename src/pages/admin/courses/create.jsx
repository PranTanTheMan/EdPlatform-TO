import { useState } from "react";
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Button,
} from "@chakra-ui/react";
import MarkdownEditor from "@/components/markdown-editor.jsx";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/router";
import withAuth from "@/components/withAuth.jsx";
import Header from "@/components/header.jsx";
import Sidebar from "@/components/adminSidebar.jsx";

const CreateCoursePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructor, setInstructor] = useState("");
  const [duration, setDuration] = useState("");
  const [intro, setIntro] = useState("");
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/course/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          title,
          description,
          instructor,
          duration,
          intro,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setTitle("");
        setDescription("");
        setInstructor("");
        setDuration("");
        setIntro("");

        console.log(data);
        toast({
          title: "Course created",
          description: "The course has been successfully created.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        router.push(`/admin/courses/${data.slug}/chapter/create`);
      } else {
        toast({
          title: "Error",
          description:
            data.message || "An error occurred while creating the course.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
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
            { href: "/admin/courses/create", label: "Create Course", isActive: true },
            {
              href: "/admin/announcements",
              label: "Post Announcements",
            },
            { href: "/admin/createUser", label: "Create a User" },
          ]}
        />
        <Flex py="2rem" px="3rem" align="center" justify="center">
          <Box maxW="100%">
            <Heading mb={8}>Create Course</Heading>
            <form onSubmit={handleFormSubmit}>
              <FormControl id="title" isRequired>
                <FormLabel>Course Title</FormLabel>
                <Input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Course Title"
                />
              </FormControl>
              <FormControl id="description" mt={4} isRequired>
                <FormLabel>Course Short Description</FormLabel>
                <Textarea
                  placeholder="Course Short Description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </FormControl>
              <FormControl id="instructor" mt={4} isRequired>
                <FormLabel>Course Instructor</FormLabel>
                <Input
                  placeholder="Course Instructor"
                  type="text"
                  value={instructor}
                  onChange={(event) => setInstructor(event.target.value)}
                />
              </FormControl>
              <FormControl id="duration" mt={4} isRequired>
                <FormLabel>Course Duration (in hours)</FormLabel>
                <Input
                  placeholder="Put an estimate"
                  type="text"
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                />
              </FormControl>
              <FormControl id="intro" mt={4} isRequired>
                <FormLabel>Introduction</FormLabel>
                <MarkdownEditor
                  handleChange={({ html, text }) => {
                    setIntro(text);
                  }}
                  value={intro}
                />
              </FormControl>
              <Button
                onClick={handleFormSubmit}
                mt={8}
                type="submit"
                colorScheme="blue"
                isLoading={isLoading}
                loadingText="Creating Course..."
              >
                Create Course
              </Button>
            </form>
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default withAuth(CreateCoursePage, "moderator");
