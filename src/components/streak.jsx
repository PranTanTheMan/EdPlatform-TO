import {
    Box,
    Flex,
    Text,
    Spacer,
    Tooltip,
    Icon,
    useColorModeValue,
  } from "@chakra-ui/react";
  import { BsFire } from "react-icons/bs";
  import { AiOutlineCheckCircle } from "react-icons/ai";
  import { FaGraduationCap } from "react-icons/fa";
  
  const Streak = () => {
    const iconHoverBg = useColorModeValue("#0D132F", "gray.700");
  
    return (
      <Box borderRadius={"10px"} bg="secondary" as="footer" w="100%" py={4}>
        <Flex px="20px" justify="center" align="center" direction="row">
          <Tooltip label="Keep going. You're doing great!" aria-label="Keep going. You're doing great!">
            <Flex
              fontSize="3xl"
              alignItems={"center"}
              transition="background 0.2s"
              borderRadius="md"
              p={2}
              _hover={{ bg: iconHoverBg }}
            >
              <Icon as={BsFire} color="#5B9FFE" />
              <Text ml="12px" mt="6px" fontSize="xl">
                5 Day Streak
              </Text>
            </Flex>
          </Tooltip>
          <Spacer />
          <Tooltip label="You're on track to finish soon!" aria-label="You're on track to finish soon!">
            <Flex
              fontSize="3xl"
              alignItems={"center"}
              transition="background 0.2s"
              borderRadius="md"
              p={2}
              _hover={{ bg: iconHoverBg }}
            >
              <Icon as={FaGraduationCap} color="#FFC65D" />
              <Text ml="8px" mt="6px" fontSize="xl">
                2 Ongoing Courses
              </Text>
            </Flex>
          </Tooltip>
  
          <Spacer />
          <Tooltip textAlign={"center"} label="Congrats! You are 1 step closer to becoming a better programmer." aria-label="Congrats! You are 1 step closer to becoming a better programmer.">
            <Flex
              fontSize="3xl"
              alignItems={"center"}
              transition="background 0.2s"
              borderRadius="md"
              p={2}
              _hover={{ bg: iconHoverBg }}
            >
              <Icon as={AiOutlineCheckCircle} color="green" />
              <Text ml="8px" mt="6px" fontSize="xl">
                4 Courses Completed
              </Text>
            </Flex>
          </Tooltip>
        </Flex>
      </Box>
    );
  };
  
  export default Streak;
  