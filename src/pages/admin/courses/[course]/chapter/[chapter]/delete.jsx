import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Box, Heading } from "@chakra-ui/react";
import { parse } from "cookie";
import useAuthStore from "@/store/authStore";
import withAuth from "@/components/withAuth";

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

  const chapterData = await res.json();

  return {
    props: {
      chapterData,
      isAuthenticated: true,
    },
  };
}

function DeleteChapter({ chapterData, isAuthenticated }) {
  const router = useRouter();
  const { course, chapter } = router.query;

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

    if (!chapterData) return <div>Course not found</div>;
  }
  async function handleDelete() {
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/courses/${course}/chapters/${chapter}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.ok) {
        router.push(`/courses/${course}`);
      } else {
        console.log("Error deleting chapter");
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  }

  return (
    <Box mt="10">
      <Heading>Delete Course: {chapterData.title}</Heading>
      <p>Are you sure you want to delete this chapter?</p>
      <Button
        colorScheme="red"
        mt="4"
        onClick={handleDelete}
        isLoading={isLoading}
      >
        Yes, delete this course
      </Button>
    </Box>
  );
}

export default withAuth(DeleteChapter, "moderator");
