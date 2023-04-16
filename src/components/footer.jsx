import { Box, Flex, Text, Link } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box bg="secondary" as="footer" w="100%" py={4} >
      <Flex justify="center" align="center" direction="column">
        <Text fontSize="sm" color="gray.500">
          © {new Date().getFullYear()} Tech Optimum. All rights reserved.
        </Text>
     
      </Flex>
    </Box>
  );
};

export default Footer;
