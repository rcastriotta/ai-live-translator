import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  VStack,
  Button,
  theme,
  Stack,
  Input,
  Divider,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState(false);

  const submitCode = async () => {
    try {
      setIsLoading(true);
      const { isAvailable } = await axios
        .post('/api/room/checkCode', {
          room: code,
        })
        .then(({ data }) => data);
      setIsLoading(false);
      if (isAvailable) {
        navigate(`../room/${code}`, { replace: true });
      } else {
        setCodeError(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const textChangeHandler = evt => {
    if (codeError) {
      setCodeError(false);
    }
    setCode(evt.target.value);
  };

  return (
    <ChakraProvider theme={theme}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <VStack spacing={5}>
          <Text color="teal.400" fontWeight="bold" fontSize="4xl">
            AI Translator
          </Text>

          <VStack spacing={3} minWidth="300px">
            <Input
              size="lg"
              fontSize="md"
              placeholder="Room code"
              value={code}
              textAlign="center"
              onChange={textChangeHandler}
              isInvalid={codeError}
            />
            <Button
              isLoading={isLoading}
              fontSize="md"
              size="lg"
              width="100%"
              onClick={submitCode}
            >
              Enter
            </Button>
          </VStack>
          <Stack direction={['column', 'row']} width="100%"></Stack>
          <Divider />
          <Button
            colorScheme="teal"
            variant="link"
            onClick={() => navigate('/host')}
          >
            Host a room
          </Button>
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default Home;
