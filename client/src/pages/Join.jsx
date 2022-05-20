import React, { useState } from 'react';
import {
  Box,
  Text,
  VStack,
  Button,
  Spinner,
  Input,
  InputGroup,
  Select,
  InputRightElement,
} from '@chakra-ui/react';

import useSocket from '../hooks/useSocket';

const CenterWrapper = ({ children }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    position="absolute"
    height="100%"
    width="100%"
  >
    {children}
  </Box>
);

const Join = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');
  const [joined, setJoined] = useState(false);
  const [translation, setTranslation] = useState(null);
  const [codeError, setCodeError] = useState(false);
  const [lang, setLang] = useState('es');
  const socket = useSocket();

  const speak = text => {
    const voice = window.speechSynthesis
      .getVoices()
      .find(v => v.lang.includes(lang));
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  const submitCode = () => {
    socket.emit('join-room', { room: code, language: lang });
    speak('');
  };

  useSocket('translation', data => {
    setTranslation(data);
    speak(data);
  });

  useSocket('room-joined', data => {
    setJoined(true);
    setIsLoading(false);
  });

  useSocket('invalid-room', data => {
    setIsLoading(false);
    setCodeError(true);
  });

  const textChangeHandler = evt => {
    if (codeError) {
      setCodeError(false);
    }
    setCode(evt.target.value);
  };

  const langChangeHandler = evt => {
    const lang = evt.target.value;
    setLang(lang);
    if (joined && code) {
      socket.emit('language-change', { room: code, language: lang });
    }
  };

  const languageDropdown = (
    <Select width="auto" value={lang} onChange={langChangeHandler} zIndex={105}>
      <option value="es">Spanish 🇪🇸 </option>
      <option value="fr">French 🇫🇷</option>
      <option value="zh">Chinese 🇨🇳</option>
    </Select>
  );

  if (!joined) {
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
          {languageDropdown}
        </VStack>
      </CenterWrapper>
    );
  }

  return (
    <>
      <Box
        position="absolute"
        textAlign="center"
        display="flex"
        padding="10px"
        flexDirection="column"
        width="100vw"
        alignItems="center"
      >
        <VStack>
          <Text color="teal.400" fontWeight="bold" fontSize="xl">
            Connected to room {code}
          </Text>
          {languageDropdown}
        </VStack>
      </Box>

      <CenterWrapper>
        <Box maxWidth="90%" textAlign="center">
          <Text fontSize="3xl">
            {translation || 'Waiting for transcription...'}
          </Text>
        </Box>
      </CenterWrapper>
    </>
  );
};

export default Join;
