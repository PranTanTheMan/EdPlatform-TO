import { useRouter } from "next/router";
import { Button, Box, Heading } from "@chakra-ui/react";
import { parse } from "cookie";
import useAuthStore from "@/store/authStore";
import withAuth from "@/components/withAuth";

export async function getServerSideProps(context) {
  const { params, req } = context;
  const { course } = params;

  const cookies = parse(req.headers.cookie || "");

  if (!cookies.auth)
    return {
      props: {
        isAuthenticated: false,
        courses: {},
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

  const courseData = await res.json();

  return {
    props: {
      course: courseData,
      isAuthenticated: true,
    },
  };
}

export default withAuth(function DeleteCoursePage({ course, isAuthenticated }) {
  const router = useRouter();

  const logout = useAuthStore((state) => state.logout);

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
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/admin/course/${course.slug}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        console.log(data);
      } else {
        console.log(data);
      }

      router.push("/courses");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box mt="10">
      <Heading>Delete Course: {course.title}</Heading>
      <p>Are you sure you want to delete this course?</p>
      <Button colorScheme="red" mt="4" onClick={handleDelete}>
        Yes, delete this course
      </Button>
    </Box>
  );
}, "moderator");
