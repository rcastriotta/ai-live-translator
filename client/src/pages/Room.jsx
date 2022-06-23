import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  VStack,
  Select,
  HStack,
  IconButton,
  Spinner,
} from '@chakra-ui/react';
import { MdVolumeUp, MdVolumeOff } from 'react-icons/md';
import useSocket from '../hooks/useSocket';
import { Icon } from '@chakra-ui/icons';
import CenterWrapper from '../components/CenterWrapper';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const voices = window.speechSynthesis.getVoices();

const Room = () => {
  const [joined, setJoined] = useState(false);
  const [muted, setMuted] = useState(true);
  const [translation, setTranslation] = useState(null);
  const [lang, setLang] = useState('es');
  const socket = useSocket();
  const { code } = useParams();
  const navigate = useNavigate();

  const speak = text => {
    const voice = voices.find(v => v.lang.includes(lang));
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    console.log(code);
    socket.emit('join-room', { room: code, language: lang });
  }, [code, socket]);

  useSocket('translation', data => {
    setTranslation(data);
    if (!muted) speak(data);
  });

  useSocket('room-joined', data => {
    setJoined(true);
  });

  useSocket('invalid-room', data => {
    navigate(`../join`, { replace: true });
  });

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
      <option value="en">English 🇺🇸</option>
    </Select>
  );

  const toggleMute = () => {
    setMuted(prev => !prev);
    speak('');
  };

  if (!joined) {
    return (
      <CenterWrapper>
        <Spinner size="xl" color="teal.400" />
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
          <HStack>
            {languageDropdown}
            <IconButton
              onClick={toggleMute}
              zIndex={105}
              aria-label="Add to friends"
              icon={<Icon w={5} h={5} as={muted ? MdVolumeOff : MdVolumeUp} />}
            />
          </HStack>
        </VStack>
      </Box>

      <CenterWrapper>
        <Box maxWidth="90%" textAlign="center">
          <Text fontSize="3xl">
            {translation || 'Waiting for translation...'}
          </Text>
        </Box>
      </CenterWrapper>
    </>
  );
};

export default Room;
