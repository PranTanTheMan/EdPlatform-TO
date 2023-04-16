import { Box, Image, Spinner } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Box w="100%" h="100vh" bgPosition="absolute" top="0" left="0" bg="#060e17">
      <Spinner size="xl" ml="50%" mt="calc(100vh * 0.5)" />
    </Box>
  );
}
