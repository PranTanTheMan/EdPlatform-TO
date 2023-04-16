import Link from "next/link";
import { Stack, Heading, Button } from "@chakra-ui/react";

export default function Custom404() {
  return (
    <Stack
      backgroundColor="secondary"
      direction="column"
      spacing={6}
      align="center"
      justify="center"
      minHeight="100vh"
    >
      <Heading>404 - Page Not Found</Heading>
      <p>The page you are looking for does not exist.</p>
      <Link href="/">
        <Button type="submit" colorScheme="blue">
          Go back to the homepage
        </Button>
      </Link>
    </Stack>
  );
}
