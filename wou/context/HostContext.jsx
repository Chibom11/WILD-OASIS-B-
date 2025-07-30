import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

const HostContext = createContext();

export const HostContextProvider = ({ children }) => {
  const [hostRooms, setHostRooms] = useState([]);
  const [paidRooms, setPaidRooms] = useState([]);
  const [unpaidRooms, setUnpaidRooms] = useState([]);

  // 1. Fetch Host Rooms
  const fetchHostRooms = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/users/gethostrooms', {
        withCredentials: true,
      });
      setHostRooms(res.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          await axios.get('http://localhost:8000/api/auth/refresh-token', {
            withCredentials: true,
          });
          const retryRes = await axios.get('http://localhost:8000/api/users/gethostrooms', {
            withCredentials: true,
          });
          setHostRooms(retryRes.data.data);
        } catch (refreshErr) {
          console.error("Token refresh failed (hostRooms):", refreshErr);
        }
      } else {
        console.error("Error fetching host rooms:", error);
      }
    }
  };

  // 2. Fetch Paid Rooms
  const fetchPaidRooms = async () => {
    try {
      const roomIds = hostRooms.map(room => room._id);
      if (roomIds.length === 0) return;

      const res = await axios.post(
        'http://localhost:8000/api/users/getpaidrooms',
        { roomIds },
        { withCredentials: true }
      );
      setPaidRooms(res.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          await axios.get('http://localhost:8000/api/auth/refresh-token', {
            withCredentials: true,
          });
          const retryRes = await axios.post(
            'http://localhost:8000/api/users/getpaidrooms',
            { roomIds: hostRooms.map(r => r._id) },
            { withCredentials: true }
          );
          setPaidRooms(retryRes.data.data);
        } catch (refreshErr) {
          console.error("Token refresh failed (paidRooms):", refreshErr);
        }
      } else {
        console.error("Error fetching paid rooms:", error);
      }
    }
  };

  // 3. Fetch Unconfirmed/Unpaid Rooms
  const fetchUnconfirmedRooms = async () => {
    try {
      const roomIds = hostRooms.map(room => room._id);
      if (roomIds.length === 0) return;

      const res = await axios.post(
        'http://localhost:8000/api/users/getunconfirmedrooms',
        { roomIds },
        { withCredentials: true }
      );
      setUnpaidRooms(res.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          await axios.get('http://localhost:8000/api/auth/refresh-token', {
            withCredentials: true,
          });
          const retryRes = await axios.post(
            'http://localhost:8000/api/users/getunconfirmedrooms',
            { roomIds: hostRooms.map(r => r._id) },
            { withCredentials: true }
          );
          setUnpaidRooms(retryRes.data.data);
        } catch (refreshErr) {
          console.error("Token refresh failed (unpaidRooms):", refreshErr);
        }
      } else {
        console.error("Error fetching unpaid rooms:", error);
      }
    }
  };

  // Initial Fetch
  useEffect(() => {
    fetchHostRooms();
  }, []);

  // Fetch Paid & Unpaid once hostRooms are ready
  useEffect(() => {
    if (hostRooms.length > 0) {
      fetchPaidRooms();
      fetchUnconfirmedRooms();
    }
  }, [hostRooms]);

  return (
    <HostContext.Provider value={{
      hostRooms,
      paidRooms,
      unpaidRooms,
    }}>
      {children}
    </HostContext.Provider>
  );
};

export default HostContext;
