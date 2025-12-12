import { io } from 'socket.io-client';

export const socket = io('https://backend.ollivu.com', {
  withCredentials: true,
  autoConnect: false, 
});
 