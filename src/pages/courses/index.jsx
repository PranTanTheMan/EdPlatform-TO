import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Wrap, Flex, Heading, Box } from "@chakra-ui/react";
import Sidebar from "@/components/side-bar";
import {
  FaGraduationCap,
  FaHome,
  FaInfoCircle,
  FaDiscord,
} from "react-icons/fa";
import { AiFillSetting } from "react-icons/ai";
import { BsFillFlagFill } from "react-icons/bs";
import Header from "@/components/header";
import Course from "@/components/course-preview";
import WithAuth from "@/components/withAuth";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/router";
import Footer from "../../components/footer";
import { parse } from "cookie";

export const getServerSideProps = async (context) => {
  const { req } = context;
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
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/courses`,
      {
        headers: {
          Authorization: `Bearer ${cookies.auth}`,
        },
      }
    );

    const courses = await res.json();

    return {
      props: {
        courses,
        isAuthenticated: true,
      },
    };
  } catch (err) {
    return {
      props: {
        courses: [],
        isAuthenticated: true,
      },
    };
  }
};

const CoursesPage = ({ courses, isAuthenticated }) => {
  console.log(courses);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  if (typeof window !== "undefined") {
    if (isAuthenticated === false) {
      logout();
      router.push("/login");
    }

    if (courses?.message) return <h1>{courses.message}</h1>;
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
          <Box px="2rem" py="2rem">
            <Heading color="primary" fontWeight="light">
              Courses
            </Heading>
            <Wrap spacing="20px" pt="1rem">
              {!courses?.message &&
                courses.map((course, index) => (
                  <Course key={index} {...course} />
                ))}
            </Wrap>
          </Box>
        </Flex>
      </Box>
      <Footer />
    </>
  );
};

export default WithAuth(CoursesPage);
