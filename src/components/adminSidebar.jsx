import {
  Flex,
  Text,
  Box,
  VStack,
  Link,
  useDisclosure,
  IconButton,
  Heading,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { RiLogoutBoxLine, RiMenuLine } from "react-icons/ri";

const SidebarLink = ({ href, icon, children, isActive }) => {
  return (
    <Link
      cursor={isActive ? "default" : "pointer"}
      href={href}
      fontWeight="medium"
      display="flex"
      alignItems="center"
      py={2}
      pl={["1rem", "2.5rem"]}
      fontSize="md"
      borderTopRightRadius={isActive ? "md" : "none"}
      borderBottomRightRadius={isActive ? "md" : "none"}
      px="2"
      color={isActive ? "blue.100" : "primary"}
      backgroundColor={isActive ? "blue.900" : "transparent"}
      _hover={{
        color: "blue.500",
        textDecoration: "none",
      }}
      width="100%"
    >
      <Box ml={"5px"}>{children}</Box>
    </Link>
  );
};

const SidebarContent = ({ links }) => (
  <VStack align="flex-start" spacing={2}>
    {links.map(({ href, label, icon, isActive }) => (
      <SidebarLink key={href} href={href} icon={icon} isActive={isActive}>
        {label}
      </SidebarLink>
    ))}
  </VStack>
);

const adminSidebar = ({ links }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isDrawer = useBreakpointValue({ base: true, md: false });

  return (
    <>
      {isDrawer && (
        <IconButton
          icon={<RiMenuLine />}
          onClick={onOpen}
          position="fixed"
          top="1.5rem"
          left="1.5rem"
          zIndex="100"
          background="blue.900"
          color="primary"
          _hover={{
            color: "primary",
          }}
        />
      )}
      <Drawer
        size="full"
        background="secondary"
        placement="left"
        onClose={onClose}
        isOpen={isOpen}
      >
        <DrawerOverlay />
        <DrawerContent background="secondary">
          <DrawerCloseButton color="primary" />
          <Heading pt="3rem" pl="2rem" color="primary">
            {" "}
            Tech Optimum
          </Heading>
          
          <Box
            pt="1rem !important"
            pl="2rem"
            background="secondary"
            fontSize={{ base: "sm", md: "md" }}
            zIndex="sticky"
          >
            <SidebarContent links={links} />
          </Box>
        </DrawerContent>
      </Drawer>

      {!isDrawer && (
        <Box
          as="aside"
          minW={{ base: "220px", md: "xs" }}
          position="sticky"
          top="0"
          height="calc(100vh)"
          background="secondary"
          overflowY="auto"
          fontSize={{ base: "sm", md: "md" }}
          zIndex="sticky"
        >
          <SidebarContent links={links} />
        </Box>
      )}
    </>
  );
};

export default adminSidebar;
