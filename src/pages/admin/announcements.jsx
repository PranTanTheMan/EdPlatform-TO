import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Button,
  Input,
  Text,
  Textarea,
  Heading,
  IconButton,
  useToast,
  Flex,
  Checkbox,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import WithAuth from "@/components/withAuth";
import useAuthStore from "@/store/authStore";
import Sidebar from "@/components/adminSidebar";
import Header from "@/components/header";



function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
}

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sendToDiscord, setSendToDiscord] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const res = await fetch("/api/announcements");
    const data = await res.json();
    setAnnouncements(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      content,
    };

    let url = "/api/announcements";
    let method = "POST";

    if (selectedAnnouncement) {
      url = `/api/announcements/${selectedAnnouncement}`;
      method = "PUT";
    }

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      setTitle("");
      setContent("");
      setSelectedAnnouncement(null);
      fetchAnnouncements();
      toast({
        title: selectedAnnouncement
          ? "Announcement updated."
          : "Announcement created.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      if (sendToDiscord && !selectedAnnouncement) {
        const discordWebhookUrl =
          "https://discord.com/api/webhooks/1095561824491024385/UjiOORo80jdbhGetiIzHHhdoKtGAaiKoXlbPJ952SSb5LfmkdpvQxhxcdVuhuLBRD-M7";

        const discordPayload = {
          embeds: [
            {
              title: payload.title,
              description: payload.content,

              fields: [
                {
                  name: "",
                  value:
                    "This announcement was sent from [here](https://dashboard.techoptimum.org/announcements)",
                },
              ],
            },
          ],
        };

        try {
          await fetch(discordWebhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(discordPayload),
          });
        } catch (error) {
          console.error("Error sending Discord webhook:", error);
        }
      }
    } else {
      toast({
        title: "An error occurred.",
        description: data.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (announcement) => {
    setSelectedAnnouncement(announcement._id);
    setTitle(announcement.title);
    setContent(announcement.content);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/announcements/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchAnnouncements;
      toast({
        title: "Announcement deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "An error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Header />
      <Flex>
        <Sidebar
          links={[
            { href: "/admin/", label: "Home" },
            { href: "/admin/courses", label: "View Courses" },
            { href: "/admin/courses/create", label: "Create Course" },
            {
              href: "/admin/announcements",
              label: "Post Announcements",
              isActive: true,
            },
            { href: "/admin/createUser", label: "Create a User" },
          ]}
        />
        <VStack display="block" py="1rem" px="3rem" spacing={4} width="100%">
         
          <Heading color="primary">Post an Announcement</Heading>
          <Box background={"secondary"} width="80%" p={4} borderRadius="lg">
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <Input
                  bgColor="#0A0F24"
                  _hover={{
                    borderColor: "transparent !important",
                  }}
                  borderColor="transparent !important"
                  placeholder="Enter the Announcement Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  isRequired
                />
                <Textarea
                  minH={"200px"}
                  bgColor="#0A0F24"
                  _hover={{
                    borderColor: "transparent !important",
                  }}
                  borderColor="transparent !important"
                  placeholder="Enter the Announcement Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  isRequired
                />
                <HStack>
                
                  <Button colorScheme="blue" type="submit">
                    {selectedAnnouncement
                      ? "Update Announcement"
                      : "Create Announcement"}
                  </Button>
                  <Checkbox
                  pl="2rem"
                  color="primary"
                    isChecked={sendToDiscord}
                    onChange={(e) => setSendToDiscord(e.target.checked)}
                  >
                    Send to Discord
                  </Checkbox>
                </HStack>
              </VStack>
            </form>
          </Box>
          <Box width="100%">
            {announcements
              .slice()
              .reverse()
              .map((announcement) => (
                <HStack
                  mb="1rem"
                  key={announcement._id}
                  p={4}
                  background={"secondary"}
                  borderRadius="lg"
                  width="100%"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <VStack alignItems="start" spacing={1}>
                    <Heading fontSize="2xl" color="primary">
                      Title: {announcement.title}
                    </Heading>
                    <Text color="primary">Content: {announcement.content}</Text>
                    <Text color="primary">
                      Created {formatDate(announcement.createdAt)}
                    </Text>
                    <Text color="primary">
                      Updated {formatDate(announcement.updatedAt)}
                    </Text>
                  </VStack>
                  <HStack>
                    <IconButton
                      colorScheme="green"
                      aria-label="Edit"
                      icon={<EditIcon />}
                      onClick={() => handleEdit(announcement)}
                    />
                    <IconButton
                      colorScheme="red"
                      aria-label="Delete"
                      icon={<DeleteIcon />}
                      onClick={() => handleDelete(announcement._id)}
                    />
                  </HStack>
                </HStack>
              ))}
          </Box>
        </VStack>
      </Flex>
    </>
  );
};

export default WithAuth(AdminAnnouncements, ["admin", "moderator"]);
