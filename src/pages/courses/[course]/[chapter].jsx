import { useRouter } from "next/router";
import { Spacer, Flex, Heading, Box, chakra, Button } from "@chakra-ui/react";
import Sidebar from "@/components/side-bar";
import Header from "@/components/header";
import ReactMarkdown from "react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { FaGraduationCap, FaHome, FaDiscord } from "react-icons/fa";
import { AiFillSetting } from "react-icons/ai";
import { BsFillFlagFill } from "react-icons/bs";
import { parse } from "cookie";
import useAuthStore from "@/store/authStore";
import Font from "@/components/font";

export default function Chapter({
  chapter,
  isAuthenticated,
  previousChapter,
  nextChapter,
}) {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  if (typeof window !== "undefined") {
    if (isAuthenticated === false) {
      logout();
      router.push("/login");
    }

    if (router.isFallback) {
      return <div>Loading...</div>;
    }

    if (chapter === null) return <div>Chapter not found</div>;
  }

  const saveProgress = async (same) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/courses/${router.query.course}/${chapter.slug}/save-progress`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const data = await res.json();

    console.log(data);

    if (res.ok) {
      console.log("ok");

      if (same) {
        router.push("/courses");
      }

      console.log(data.message);

      if (data.message === "Chapter already completed") {
        if (same) {
          router.push(`/courses`);
        }
        router.push(`/courses/${router.query.course}/${nextChapter}`);
      }
      router.push(`/courses/${router.query.course}/${nextChapter}`);
    }
  };
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

          <Box width="100%" px="2rem" py="3rem">
            <Heading color="primary" fontWeight="bold">
              {chapter.title}
            </Heading>
            <ReactMarkdown
              components={ChakraUIRenderer()}
              children={chapter.markdown}
              skipHtml
            />

            <Flex justifyContent="space-between" my="2rem">
              {previousChapter && (
                <chakra.a
                  transition="all 0.2s"
                  _hover={{
                    cursor: "pointer",
                    backgroundColor: "blue.800",
                  }}
                  py="10px"
                  textAlign={"center"}
                  borderRadius={"10px"}
                  width="100%"
                  backgroundColor="blue.900"
                  href={`/courses/${router.query.course}/${previousChapter}`}
                >
                  Previous Chapter
                </chakra.a>
              )}
              <Spacer />

              <chakra.a
                ml="1rem"
                textAlign="center"
                transition="all 0.2s"
                _hover={{ cursor: "pointer", backgroundColor: "blue.800" }}
                py="10px"
                borderRadius="10px"
                width="100%"
                backgroundColor="blue.900"
                onClick={() =>
                  saveProgress(
                    nextChapter
                      ? nextChapter === router.query.chapter
                        ? "same"
                        : undefined
                      : "same"
                  )
                }
              >
                {nextChapter
                  ? nextChapter === router.query.chapter
                    ? "Complete Course"
                    : "Next Chapter"
                  : "Complete Course"}
              </chakra.a>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  );
}

export async function getServerSideProps(context) {
  const { params, req } = context;
  const { course, chapter } = params;

  const cookies = parse(req.headers.cookie || "");

  if (!cookies.auth) {
    return {
      props: {
        isAuthenticated: false,
        chapter: {},
      },
    };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/courses/${course}/${chapter}`,
      {
        headers: {
          Authorization: `Bearer ${cookies.auth}`,
        },
      }
    );

    const Data = await res.json();

    if (!res.ok || !Data) {
      return {
        props: {
          chapter: null,
          previousChapter: {},
          nextChapter: {},
          isAuthenticated: true,
        },
      };
    }

    const { chapter: chapterData, previousChapter, nextChapter } = Data;

    return {
      props: {
        chapter: chapterData,
        previousChapter,
        nextChapter,
        isAuthenticated: true,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: {
        chapter: {},
        previousChapter: {},
        nextChapter: {},
        isAuthenticated: true,
      },
    };
  }
}
