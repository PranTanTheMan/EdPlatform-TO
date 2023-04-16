import {
  Box,
  Flex,
  HStack,
  Icon,
  Input,
  Button,
  Avatar,
  Popover,
  PopoverTrigger,
  Tooltip,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  Text,
} from "@chakra-ui/react";
import { FaSearch, FaUser } from "react-icons/fa";
import { HiXMark } from "react-icons/hi";
import { useState, useEffect } from "react";
import useAuthStore from "@/store/authStore";
import { RiLogoutBoxLine } from "react-icons/ri";
import { AiFillSetting } from "react-icons/ai";

const Header = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (user) {
      setUserName(user.name);
    }
  }, [user]);

  return (
    <Box
      w={"100%"}
      px="2rem"
      position="sticky"
      top="0"
      zIndex="docked"
      bgColor="secondary"
    >
      <Flex ml={["3rem", "0rem"]} justify="space-between" align="center" p={4}>
        <Text
          color="primary"
          mt={{ base: "5px", md: "0", lg: "0" }}
          pl={{ base: "10px", md: "0px !important", lg: "0px" }}
          fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
          fontWeight="bold"
        >
          Tech Optimum
        </Text>

        {/* Unchanged code */}

        <Popover>
          <PopoverTrigger>
            <Button
              py="26px"
              borderRadius="8px"
              _hover={{
                background: "transparent",
              }}
              _focus={{
                background: "transparent",
              }}
              _active={{
                background: "transparent",
              }}
              background="transparent"
            >
              <HStack color="primary" spacing={4}>
                <Avatar size="md" name={userName} />
                <Text fontSize="lg" mt="3px !important" fontWeight="medium">
                  {userName}
                </Text>
              </HStack>
            </Button>
          </PopoverTrigger>
          <PopoverContent border="none" bg="secondary">
            <PopoverCloseButton />

            <PopoverBody>
              <Button mr="10px" colorScheme="blue" as="a" href="/settings">
                <HStack alignItems="center" spacing={2}>
                  <AiFillSetting />
                  <Text mt="2px !important" fontSize="md" fontWeight="medium">
                    Settings
                  </Text>
                </HStack>
              </Button>
              <Button
                onClick={logout}
                colorScheme="red"
                _hover={{
                  textDecoration: "none",
                }}
              >
                <HStack alignItems="center" spacing={2}>
                  <RiLogoutBoxLine />
                  <Text mt="2px !important" fontSize="md" fontWeight="medium">
                    Logout
                  </Text>
                </HStack>
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>
    </Box>
  );
};

export default Header;
