import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Text,
  VStack,
  Button,
  Spacer,
  Stack,
  Spinner,
  Divider,
} from '@chakra-ui/react';
import useSocket from '../hooks/useSocket';
import useUserMedia from '../hooks/useUserMedia';
import axios from 'axios';

const displayTranscription = transcript => {
  return transcript.elements.reduce((a, b) => {
    a += ` ${b.value}`;
    return a;
  }, '');
};

const bufferLength = 1024;
window.AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext = new AudioContext();
let analyser = audioContext.createAnalyser();
analyser.fftSize = bufferLength;

const Host = () => {
  const [transcript, setTranscript] = useState(null);
  const [room, setRoom] = useState(null);
  const isMounted = React.useRef(false);
  const roomRef = useRef();
  const socket = useSocket();

  useSocket('transcript', data => {
    setTranscript(data);
  });

  useSocket('streaming-connected', connectionMessage => {
    console.log(`Connection Message: ${JSON.stringify(connectionMessage)}`);
    if (connectionMessage.type === 'connected') {
      console.log('connected');
      audioStreamer.startStreaming();
    }
  });

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;
    (async () => {
      const { data } = await axios.post('/api/room/create');
      socket.emit('join-room', { room: data });
      setRoom(data);
      roomRef.current = data;
    })();
  }, [socket]);

  const audioStreamer = useUserMedia({
    constraints: { audio: true, video: false },
    streamListener: stream => {
      let source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
    },
    dataCb: data => {
      console.log('emited');
      socket.emit('stream', { data, room: roomRef.current });
    },
  });

  const startStreaming = async () => {
    await axios.post('/api/stream/start', {
      room,
    });
    console.log('started');
  };

  const stopStreaming = async () => {
    await axios.post('/api/stream/stop', {
      room,
    });
    audioStreamer.stopStreaming();
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100%"
      padding="20px"
      textAlign="center"
    >
      {!room ? (
        <Spinner size="xl" color="teal.400" />
      ) : (
        <VStack spacing={3}>
          <Text color="teal.400" fontWeight="bold" fontSize="4xl">
            Your session code is {room}
          </Text>

          <Spacer />
          <Stack
            direction={['column', 'row']}
            width="100%"
            display="flex"
            justifyContent="center"
          >
            {audioStreamer.connected && audioStreamer.streaming ? (
              <Button
                size="lg"
                fontSize="md"
                onClick={stopStreaming}
                maxWidth="400px"
                width="100%"
              >
                Stop Recording
              </Button>
            ) : (
              <Button
                size="lg"
                fontSize="md"
                onClick={startStreaming}
                maxWidth="400px"
                width="100%"
              >
                Start Recording
              </Button>
            )}
          </Stack>
          <Divider margin="30px !important" />
          {transcript ? displayTranscription(transcript) : null}
          <Text>
            {transcript
              ? displayTranscription(transcript)
              : 'Your transcription will appear here...'}
          </Text>
        </VStack>
      )}
    </Box>
  );
};

export default Host;
