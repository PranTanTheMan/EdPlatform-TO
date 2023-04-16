import { useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Box,
  Heading,
  FormControl,
  Flex,
  FormLabel,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import MarkdownEditor from "@/components/markdown-editor.jsx";
import { parse } from "cookie";
import useAuthStore from "@/store/authStore";
import withAuth from "@/components/withAuth";
import Header from "@/components/header";
import Sidebar from "@/components/adminSidebar";

const EditChapterPage = ({ chapter, isAuthenticated }) => {
  const router = useRouter();
  const toast = useToast();

  const [title, setTitle] = useState(chapter?.title);
  const [id, setId] = useState(chapter?.id);
  const [markdown, setMarkdown] = useState(chapter.markdown);
  const [isLoading, setIsLoading] = useState(false);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  if (typeof window !== "undefined") {
    if (isAuthenticated === false) {
      logout();
      router.push("/login");
    }

    if (router.isFallback) {
      return <div>Loading...</div>;
    }

    if (!chapter) return <div>Course not found</div>;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(
        `/api/courses/${router.query.course}/chapters/${chapter.slug}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            id,
            title,
            markdown,
          }),
        }
      );

      if (res.status === 200) {
        toast({
          title: "Chapter updated",
          description: "The chapter has been successfully updated.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        router.push(`/courses/${router.query.courseId}`);
      } else {
        const errorData = await res.json();

        toast({
          title: "Error",
          description: errorData.message || "An error occurred.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
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
            {
              href: "/admin/courses/create",
              label: "Create Course",
              isActive: true,
            },
            {
              href: "/admin/announcements",
              label: "Post Announcements",
            },
            { href: "/admin/createUser", label: "Create a User" },
          ]}
        />
        <Container maxW="container.lg" py={8}>
          <Box p={4} shadow="md" borderRadius="md">
            <Heading size="md" mb={4}>
             


          Edit Chapter 
        </Heading>
        <form onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>ID</FormLabel>
            <Input
              type="number"
              name="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Markdown</FormLabel>
            <MarkdownEditor
              name="markdown"
              handleChange={({ html, text }) => {
                setMarkdown(text);
              }}
              value={markdown}
            />
          </FormControl>
          <Button type="submit" colorScheme="blue" isLoading={isLoading} loadingText="Saving...">
  Save
</Button>

        </form>
      </Box>
    </Container>
    </Flex>
    </>
  );
};

export async function getServerSideProps(context) {
  const { params, req } = context;
  const { course, chapter } = params;

  const cookies = parse(req.headers.cookie || "");

  if (!cookies.auth)
    return {
      props: {
        isAuthenticated: false,
        chapter: {},
      },
    };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/courses/${course}/${chapter}`,
    {
      headers: {
        Authorization: `Bearer ${cookies.auth}`,
      },
    }
  );

  const Data = await res.json();

  return {
    props: {
      chapter: Data.chapter,
      isAuthenticated: true,
    },
  };
}

export default withAuth(EditChapterPage, "moderator");
