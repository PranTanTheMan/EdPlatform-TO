import { useRouter } from "next/router";
import { Flex, Heading, Box, Text } from "@chakra-ui/react";
import Sidebar from "@/components/side-bar";
import Header from "@/components/header";
import { FaGraduationCap, FaHome, FaDiscord } from "react-icons/fa";
import { AiFillSetting } from "react-icons/ai";
import { BsFillFlagFill } from "react-icons/bs";
import { parse } from "cookie";
import useAuthStore from "@/store/authStore";
import withAuth from "@/components/withAuth";
import Font from "@/components/font";

export default withAuth(function Course({ course, isAuthenticated }) {
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

  return (
    <>
      <Box bg="#060E17 !important">
        <Header />
        <Flex>
          <Sidebar
            links={[
              { href: "/", label: "Home", icon: FaHome },
              {
                href: "/courses",
                label: "Courses",
                icon: FaGraduationCap,
                isActive: true,
              },
              {
                href: "/internships",
                label: "Internship Finder",
                icon: BsFillFlagFill,
              },
              { href: "/settings", label: "Settings", icon: AiFillSetting },
              {
                href: "https://techoptimum.org/discord",
                label: "Discord Server",
                icon: FaDiscord,
              },
            ]}
          />

          <Box px="2rem" py="3rem">
            <Heading color="primary" fontWeight="bold">
              {course?.title}
            </Heading>
            <Text>
              <strong>Course Description:</strong> {course?.description}
            </Text>

            {course?.chapters?.map((chapter, index) => (
              <a key={index} href={`/courses/${course.slug}/${chapter.slug}`}>
                <Text py="5px" pl="25x" color="primary">
                  Lesson {chapter.id} {chapter.title}
                </Text>
              </a>
            ))}
          </Box>
        </Flex>
      </Box>
    </>
  );
});

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

  try {
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
  } catch (err) {
    console.log(err);

    return {
      props: {
        course: {},
        isAuthenticated: false,
      },
    };
  }
}
