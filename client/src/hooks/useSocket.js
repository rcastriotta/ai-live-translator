import { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_SERVER_BASE_URL);
socket.on('connect', () => {
  console.log(`socket connected (${socket.id})`);
});
socket.on('disconnect', () => {
  console.log('socket disconnected');
});

export default function useSocket(eventName, cb) {
  useEffect(() => {
    if (!eventName || !cb) return;
    socket.on(eventName, cb);

    return function useSocketCleanup() {
      socket.off(eventName, cb);
    };
  }, [eventName, cb]);

  return socket;
}
