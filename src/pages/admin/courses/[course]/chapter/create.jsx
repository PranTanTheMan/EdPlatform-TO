import { useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Flex,
  VStack,
} from "@chakra-ui/react";
import useAuthStore from "@/store/authStore";
import MarkdownEditor from "@/components/markdown-editor.jsx";
import withAuth from "@/components/withAuth";
import { parse } from "cookie";
import Header from "@/components/header";
import Sidebar from "@/components/adminSidebar";

export default withAuth(function CreateChapterPage({ course }) {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [id, setId] = useState("");
  const [markdown, setMarkdown] = useState("");
  const user = useAuthStore((state) => state.user);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await fetch(
        `/api/admin/course/${router.query.course}/chapter/create`,
        {
          method: "POST",
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
      const data = await res.json();

      if (res.ok) {
        setTitle("");
        setId("");
        setMarkdown();
        toast({
          title: "Chapter created",
          description: "The chapter has been successfully created.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        
      } else {
        toast({
          title: "Error",
          description: data.message || "An error occurred while creating the chapter.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
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
        <Container py="2rem" px="3rem">
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl id="title" isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormControl>
              <FormControl id="id" isRequired>
                <FormLabel>Id</FormLabel>
                <Input
                  type="number"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
              </FormControl>
              <FormControl id="markdown" isRequired>
                <FormLabel>Markdown</FormLabel>
                <MarkdownEditor
                  handleChange={({ html, text }) => {
                    setMarkdown(text);
                  }}
                  value={markdown}
                />
              </FormControl>
              <Button colorScheme="blue" type="submit" isLoading={isLoading} loadingText="Creating Chapter...">
  Create Chapter
</Button>

            </VStack>
          </form>
        </Container>
      </Flex>
    </>
  );
}, "moderator");

export async function getServerSideProps(context) {
  const { params, req } = context;
  const { course } = params;

  const cookies = parse(req.headers.cookie || "");

  if (!cookies.auth)
    return {
      props: {
        isAuthenticated: false,
        chapter: {},
      },
    };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/courses/${course}`,
    {
      headers: {
        Authorization: `Bearer ${cookies.auth}`,
      },
    }
  );

  const chapterData = await res.json();

  return {
    props: {
      chapter: chapterData,
      isAuthenticated: true,
    },
  };
}
