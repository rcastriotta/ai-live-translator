import React, { useState } from 'react';
import {
  Text,
  VStack,
  Button,
  Spinner,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import CenterWrapper from '../components/CenterWrapper';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Join = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState(false);
  const navigate = useNavigate();

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
    <CenterWrapper>
      <VStack spacing={3}>
        <Text color="teal.400" fontWeight="bold" fontSize="4xl">
          Enter code
        </Text>
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            placeholder="Type here..."
            value={code}
            onChange={textChangeHandler}
            isInvalid={codeError}
          />
          <InputRightElement width="4.5rem">
            {isLoading ? (
              <Spinner size="sm" color="teal.400" />
            ) : (
              <Button h="1.75rem" size="sm" onClick={submitCode}>
                Join
              </Button>
            )}
          </InputRightElement>
        </InputGroup>
      </VStack>
    </CenterWrapper>
  );
};

export default Join;
