import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  VStack,
  Button,
  theme,
  Spacer,
  Stack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <ChakraProvider theme={theme}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <VStack spacing={3}>
          <Text color="teal.400" fontWeight="bold" fontSize="4xl">
            Welcome!
          </Text>

          <Text fontSize="lg">Please choose an option to continue</Text>
          <Spacer />
          <Spacer />
          <Stack direction={['column', 'row']} width="100%">
            <Button onClick={() => navigate('/join')} width="100%">
              Join
            </Button>
            <Button onClick={() => navigate('/host')} width="100%">
              Host
            </Button>
          </Stack>
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default Home;
