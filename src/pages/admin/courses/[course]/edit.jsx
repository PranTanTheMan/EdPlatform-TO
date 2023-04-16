import { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Heading,
  Textarea,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import MarkdownEditor from "@/components/markdown-editor.jsx";
import { parse } from "cookie";
import useAuthStore from "@/store/authStore";
import withAuth from "@/components/withAuth";
import { type } from "os";

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

export default withAuth(function EditCoursePage({ course, isAuthenticated }) {
  console.log(course);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [title, setTitle] = useState(course?.title);
  const [description, setDescription] = useState(course?.description);
  const [instructor, setInstructor] = useState(course?.instructor);
  const [duration, setDuration] = useState(course?.duration);
  const [intro, setIntro] = useState(course?.intro);

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/course/${course.slug}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(formValues),
      });
      const data = await res.json();
      if (res.ok) {
        setTitle("");
        setDescription("");
        setInstructor("");
        setDuration(0);
        setIntro("");

        console.log(data);
        router.push(`/courses/${course.slug}`);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box mx="100px" my="40px">
      <Heading color="primary">Edit Course: {course.title}</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mt="4">
          <FormLabel>Title</FormLabel>
          <Input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </FormControl>
        <FormControl mt="4">
          <FormLabel>Description</FormLabel>
          <Textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </FormControl>
        <FormControl mt="4">
          <FormLabel>Instructor</FormLabel>
          <Input
            type="text"
            name="instructor"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            required
          />
        </FormControl>
        <FormControl mt="4">
          <FormLabel>Duration</FormLabel>
          <Input
            type="text"
            name="d"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </FormControl>
        <FormControl mt="4">
          <FormLabel>Intro</FormLabel>
          <MarkdownEditor
            name="intro"
            handleChange={({ html, text }) => {
              setIntro(text);
            }}
            value={intro}
          />
        </FormControl>
        <Button type="submit" colorScheme="blue" mt="4">
          Save Changes
        </Button>
      </form>
    </Box>
  );
}, "moderator");
