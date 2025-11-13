import { useEffect } from "react";

import { getSocket } from "@/lib/socket";

export function useSocketChannel<T = unknown>(
  event: string,
  onData: (payload: T) => void,
) {
  useEffect(() => {
    const socket = getSocket();
    const handler = (payload: T) => onData(payload);
    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
  }, [event, onData]);
}

export default useSocketChannel;
