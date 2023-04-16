// components/AnnouncementsList.js
import React, { useState, useEffect } from "react";
import { Box, VStack, Flex, Heading, Text } from "@chakra-ui/react";
import Sidebar from "@/components/side-bar";
import Header from "@/components/header";
import {
  FaGraduationCap,
  FaHome,
  FaInfoCircle,
  FaDiscord,
} from "react-icons/fa";
import { AiFillSetting } from "react-icons/ai";
import { BsFillFlagFill } from "react-icons/bs";
import { MdOutlineAnnouncement } from "react-icons/md";

const AnnouncementsList = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const res = await fetch("/api/announcements");
    const data = await res.json();
    setAnnouncements(data);
  };

  return (
    <>
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
            },
            { href: "/settings", label: "Settings", icon: AiFillSetting },
            // {
            //   href: "https://techoptimum.org/discord",
            //   label: "Discord Server",
            //   icon: FaDiscord,
            // },
            {
              href: "/announcements",
              label: "Announcements",
              icon: MdOutlineAnnouncement,
              isActive: true,
            },
          ]}
        />
        <VStack spacing={4} width="100%">
          <Heading as="h3" size="lg">
            Announcements
          </Heading>
          {announcements.map((announcement) => (
            <Box
              key={announcement._id}
              width="100%"
              p={4}
              borderWidth={1}
              borderRadius="lg"
            >
              <Heading as="h4" size="md">
                {announcement.title}
              </Heading>
              <Text>{announcement.content}</Text>
            </Box>
          ))}
        </VStack>
      </Flex>
    </>
  );
};

export default AnnouncementsList;
