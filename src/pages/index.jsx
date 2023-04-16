import { Box, Flex, Heading, Wrap, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Course from "@/components/course-preview";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Sidebar from "@/components/side-bar";
import {
  FaHome,
  FaGraduationCap,
  FaInfoCircle,
  FaDiscord,
} from "react-icons/fa";
import { AiFillSetting } from "react-icons/ai";
import { BsFillFlagFill } from "react-icons/bs";
import WithAuth from "@/components/withAuth";
import useAuthStore from "@/store/authStore";
import Streak from "@/components/streak";

const Home = () => {
  const Greeting = () => {
    const date = new Date();
    const hours = date.getHours();
    if (hours < 12) {
      return "Good Morning";
    } else if (hours >= 12 && hours <= 17) {
      return "Good Afternoon";
    } else if (hours >= 17 && hours <= 24) {
      return "Good Evening";
    }
  };
  const user = useAuthStore((state) => state.user);
  const [courses, setCourses] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      }
    };

    if (user) {
      setUserName(user.name);
      fetchCourses();
    }
  }, [user]);
  console.log("all courses", courses);

  return (
    <>
      <Box bg="#060E17 !important">
        <Header />
        <Flex>
          <Sidebar
            links={[
              { href: "/", label: "Home", icon: FaHome, isActive: true },
              { href: "/courses", label: "Courses", icon: FaGraduationCap },
              {
                href: "/internships",
                label: "Internship Finder",
                icon: BsFillFlagFill,
              },
              { href: "/settings", label: "Settings", icon: AiFillSetting },
              // {
              //   href: "https://techoptimum.org/discord",
              //   label: "Discord Server",
              //   icon: FaDiscord,
              // },
            ]}
          />
          <Box px="2rem" py="2rem">
            <Heading
              fontSize="5xl"
              pb="1rem"
              color="primary"
              fontWeight="light"
            >
              {Greeting()}, {userName}
            </Heading>

            <Heading fontSize="4xl" color="primary" fontWeight="light" mb={3}>
              Overview
            </Heading>
            <Streak />
            <Heading
              mt={8}
              fontSize="3xl"
              color="primary"
              fontWeight="light"
              mb={4}
            >
              In Progress Courses
            </Heading>
            <Wrap spacing="20px" pb="1rem">
              {Array.isArray(courses) &&
                courses.length > 0 &&
                courses
                  .filter((course) => course.enrolled && course.progress < 100)
                  .map((course, index) => <Course key={index} {...course} />)}
            </Wrap>
            <Heading
              fontSize="3xl"
              color="primary"
              fontWeight="light"
              mt={4}
              mb={4}
            >
              Other Courses
            </Heading>
            <Wrap spacing="20px" pb="1rem">
              {Array.isArray(courses) &&
                courses.length > 0 &&
                courses
                  .filter((course) => !course.enrolled)
                  .map((course, index) => <Course key={index} {...course} />)}
            </Wrap>
            <Heading fontSize="3xl" color="primary" fontWeight="light" mb={4}>
              Completed Courses
            </Heading>
            <Wrap spacing="20px" pb="1rem">
              {Array.isArray(courses) &&
                courses.length > 0 &&
                courses
                  .filter((course) => course.enrolled && course.progress > 95)
                  .map((course, index) => <Course key={index} {...course} />)}
            </Wrap>
          </Box>
        </Flex>
      </Box>
      <Footer />
    </>
  );
};

export default WithAuth(Home);
