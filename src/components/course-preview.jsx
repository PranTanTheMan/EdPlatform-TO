import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  Progress,
  DrawerOverlay,
  Heading,
  useDisclosure,
  Link,
  CircularProgress,
  CircularProgressLabel,
  DrawerContent,
  DrawerCloseButton,
  Tooltip,
  Flex,
  Box,
  Button,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import React from "react";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/router";

const Course = ({
  progress,
  title,
  description,
  enrolled,
  chapters,
  slug,
  instructor,
}) => {
  const [isEnrolled, setIsEnrolled] = useState(enrolled);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const enroll = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/courses/${slug}/enroll`,
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
      setIsEnrolled(true);
    }
  };
  const continueCourse = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/courses/${slug}/progress`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const data = await res.json();

    if (data.length === 0) {
      router.push(`/courses/${slug}/${chapters[0].slug}`);
    }

    let chapter;
    for (let i = 0; i < chapters.length; i++) {
      if (!data?.progress?.includes(chapters[i].slug)) {
        chapter = chapters[i];
        break;
      }
    }

    if (!chapter) {
      alert("you have completed the course");
    }

    router.push(`/courses/${slug}/${chapter.slug}`);

    console.log(data);

    if (res.ok) {
      console.log("ok");
    }
  };

  const btnRef = React.useRef();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const displayDescription = isExpanded
    ? description
    : description.slice(0, 130) + (description.length > 130 ? "..." : "");
  // ...
  return (
    <Box
      bgColor="secondary"
      w="300px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      mb={4}
      p={4}
    >
      <Flex direction="column" justifyContent="space-between" h="100%">
        <Box>
          <Heading color="primary" fontSize="2xl" mb={2}>
            {title}
          </Heading>
          <Text fontSize="sm" mb={1}>
            {displayDescription}
          </Text>
          {description.length > 50 && (
            <Text
              _hover={{
                cursor: "pointer",
                textDecoration: "none",
              }}
              textDecor={"underline"}
              onClick={toggleExpanded}
              fontSize="sm"
            >
              {isExpanded ? "See less" : "See more"}
            </Text>
          )}
        </Box>
        <Flex mt={4} justify="space-between" align="center" mb={2}>
          <CircularProgress
            trackColor="green.900"
            value={progress}
            color="#4DCE36"
          >
            <CircularProgressLabel>{progress}%</CircularProgressLabel>
          </CircularProgress>
          <Flex>
            <Button
              as="a"
              ref={btnRef}
              onClick={onOpen}
              fontWeight={"light"}
              colorScheme="blue"
              _hover={{
                cursor: "pointer",
              }}
            >
              {isEnrolled ? "Continue Course" : "Begin Course"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent backgroundColor="secondary">
          <DrawerCloseButton mt="8px" color="primary" />
          <DrawerHeader fontSize="2xl" color="primary">
            {title}
          </DrawerHeader>

          <DrawerBody>
            <Text color="primary">{description}</Text>

            <Box
              border={"1px"}
              borderColor="#0E1E31"
              px="15px"
              py="5px"
              borderRadius="10px"
              mt="1rem"
              bgColor="#0A0F24"
            >
              <Text
                fontWeight="bold"
                fontSize="2xl"
                mt="3px"
                color="primary"
                mr="10px"
              >
                Curriculum
              </Text>

              {isEnrolled ? (
                <>
                  <Progress
                    backgroundColor={"blue.200"}
                    isAnimated="true"
                    hasStripe="true"
                    borderRadius={"10px"}
                    size="sm"
                    colorScheme="facebook"
                    value={progress}
                  />
                  {chapters.map((chapter, index) => (
                    <Link key={index} href={`/courses/${slug}/${chapter.slug}`}>
                      <Text py="5px" pl="25x" color="primary">
                        Lesson {index + 1}: {chapter.title}
                      </Text>
                    </Link>
                  ))}

                  <Button
                    my="1rem"
                    onClick={() => continueCourse()}
                    fontWeight={"light"}
                    colorScheme="blue"
                  >
                    Continue Course
                  </Button>
                </>
              ) : (
                <>
                  {chapters.map((chapter, index) => (
                    <Tooltip
                      color="primary"
                      bg="secondary"
                      placement="top"
                      label="Enroll in the course to view the chapters"
                    >
                      <Text key={index} py="5px" pl="25x" color="primary">
                        Lesson {index + 1}: {chapter.title}
                      </Text>
                    </Tooltip>
                  ))}

                  <Button
                    my="1rem"
                    onClick={() => enroll()}
                    fontWeight={"light"}
                    colorScheme="blue"
                  >
                    Enroll Now
                  </Button>
                </>
              )}
            </Box>
          </DrawerBody>

          <DrawerFooter align="left">
            <Text color={"primary"} pb="10px" pr="5px" fontSize="sm">
              Course Instructor: {instructor}
            </Text>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Course;
