import { useEffect } from 'react';
import axios from 'axios';
import useStore from '../store';

const usePingServer = (isConnected) => {
  const hostname = useStore(state => state.hostname);

  useEffect(() => {
    let interval;

    if (isConnected) {
      // Immediate first ping
      axios.get(`${hostname}/ping`)
        .then(res => console.log('Ping response:', res.data))
        .catch(err => console.log('Ping error:', err.message));

      // Then ping every 60 seconds
      interval = setInterval(() => {
        axios.get(`${hostname}/ping`)
          .then(res => console.log('Ping response:', res.data))
          .catch(err => console.log('Ping error:', err.message));
      }, 60000);
    }

    // Cleanup
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected, hostname]);
};

export default usePingServer;
