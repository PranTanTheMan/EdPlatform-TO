import { Inter } from "next/font/google";
import {
  Link,
  Badge,
  Text,
  Input,
  Wrap,
  Flex,
  Heading,
  Icon,
  InputGroup,
  InputLeftElement,
  Modal,
  Button,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Select,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
} from "@chakra-ui/react";
import Sidebar from "../components/side-bar";
import { FaGraduationCap, FaHome, FaDiscord } from "react-icons/fa";
import { AiFillSetting } from "react-icons/ai";
import { BsFillFlagFill } from "react-icons/bs";
import React, { useState, useEffect } from "react";
import { FaSearch, FaUser } from "react-icons/fa";
import Header from "../components/header";
import WithAuth from "../components/withAuth";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BiMoneyWithdraw } from "react-icons/bi";
import { BsCalendar2Date } from "react-icons/bs";
import { AiOutlineLink, AiOutlineInfoCircle } from "react-icons/ai";

const NOTION_ID = process.env.NOTION_ID || "0f5efab227854df6a76079e7e73b9dd2";

export const getAllPosts = async () => {
  return await fetch(
    `https://notion-api.splitbee.io/v1/table/${NOTION_ID}`
  ).then((res) => res.json());
};

export async function getStaticProps() {
  const posts = await getAllPosts();
  return {
    props: {
      posts,
    },
  };
}

function InternshipPost({ post }) {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <>
      <Box
        mt="1.5rem"
        borderRadius="10px"
        padding="1rem 2rem"
        maxW="600px"
        bgColor="#0A0F24"
        key={post.id}
        display="block"
      >
        <Box display="block">
          <Heading fontWeight="light" color="primary" fontSize="2xl">
            {post.title}
          </Heading>
          <Badge colorScheme="teal">{post.category}</Badge>
          <Text color="primary">
            <BsCalendar2Date />
            posted on {post.date}
          </Text>
          <Button fontWeight="light" colorScheme="blue" onClick={onOpen}>
            <AiOutlineInfoCircle />
            Learn More
          </Button>
        </Box>
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay bgColor="#0A0F24" />
          <ModalContent bgColor="secondary">
            <ModalCloseButton />

            <ModalBody>
              <Heading pt="1rem" pr="1rem" fontSize="3xl" color="primary">
                {post.title}
              </Heading>
              <Badge colorScheme="teal">{post.category}</Badge>

              <Flex alignItems="center">
                <Text fontSize="2xl" color="primary">
                  <AiOutlineInfoCircle />
                </Text>
                <Text pl="4px" pt="4px" color="primary">
                  {post.description}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="2xl" color="primary">
                  <HiOutlineLocationMarker />
                </Text>
                <Text pl="4px" pt="4px" color="primary">
                  {post.location}
                </Text>
              </Flex>

              <Flex alignItems="center">
                <Text fontSize="2xl" color="primary">
                  <BiMoneyWithdraw />
                </Text>
                <Text pl="4px" pt="4px" color="primary">
                  {post.salary}
                </Text>
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="outline"
                colorScheme="blue"
                as="a"
                href={post.link}
              >
                <AiOutlineLink />
                Apply Now
              </Button>
              <Button ml="1rem" colorScheme="blue" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
            <Text pb="12px" textAlign={"center"} fontSize="sm" color="primary">
              This internship was posted on {post.date}
            </Text>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
}

function Internships({ posts }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(posts);

  useEffect(() => {
    const filtered = posts.filter((post) => {
      const matchesSearch = post.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        filterCategory === "" || post.category[0] === filterCategory;

      // Add debug information
      console.log("Filter category:", filterCategory);
      console.log("Post category:", post.category[0]);
      console.log("Match:", matchesCategory);

      return matchesSearch && matchesCategory;
    });
    setFilteredPosts(filtered);
  }, [search, posts, filterCategory]);

  const categories = [...new Set(posts.map((post) => post.category))].sort();

  return (
    <>
      <Box bg="#060E17 !important">
        <Header />
        <Flex>
          <Sidebar
            links={[
              { href: "/", label: "Home", icon: FaHome },
              { href: "/courses", label: "Courses", icon: FaGraduationCap },
              {
                href: "/internships",
                label: "Internship Finder",
                icon: BsFillFlagFill,
                isActive: true,
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
            <Heading color="primary" fontWeight="light">
              Internship Finder
            </Heading>
            <Heading
              color="primary"
              fontWeight="light"
              fontSize="lg"
              mt=".6rem"
              mb="2rem"
            >
              Explore our carefully curated database of premier computer science
              internships at industry-leading companies
            </Heading>
            <Box
              textAlign={"center"}
              alignItems="center"
              justifyContent="center"
              margin="auto"
            >
              <Box
                alignItems={"center"}
                display="flex"
                justifyContent={"space-between"}
                maxW="800px"
              >
                <Flex alignItems="center">
                  <InputGroup
                    _hover={{
                      borderColor: "transparent !important",
                    }}
                    borderColor="transparent !important"
                  >
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaSearch} color="gray.500" />
                    </InputLeftElement>

                    <Input
                      bgColor="#0A0F24"
                      _hover={{
                        borderColor: "transparent !important",
                      }}
                      margin="auto"
                      textAlign="center"
                      placeholder="Type in an organization or keyword to search for internships here."
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </InputGroup>

                  <Select
                    margin="auto"
                    textAlign={"center"}
                    ml="1rem"
                    borderColor="transparent !important"
                    bgColor="#0A0F24"
                    color="gray.500"
                    placeholder="Filter by category"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </Select>
                </Flex>
              </Box>

              <Wrap display={"block"} mt="3rem" spacing={7}>
                {filteredPosts.map((post) => (
                  <InternshipPost key={post.id} post={post} />
                ))}
              </Wrap>
            </Box>
          </Box>
        </Flex>
      </Box>
    </>
  );
}

export default WithAuth(Internships);
