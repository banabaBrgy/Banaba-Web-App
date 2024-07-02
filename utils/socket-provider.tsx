"use client";

import { UserType } from "@/lib/user";
import {
  MutableRefObject,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";

type SocketProviderProp = {
  children: ReactNode;
  user: UserType | null;
};

type ActiveUser = {
  socketId: string;
  userId: string;
};

type ContextType = {
  activeUser: ActiveUser[];
  socket: MutableRefObject<Socket | null>;
};

const Context = createContext({} as ContextType);

export const SocketProvider = ({ children, user }: SocketProviderProp) => {
  const socket = useRef<Socket | null>(null);
  const [activeUser, setActiveUser] = useState<ActiveUser[]>([]);

  useEffect(() => {
    socket.current = io("http://localhost:3001");
  }, []);

  useEffect(() => {
    if (user?.id) {
      socket.current?.emit("active:user", user?.id);
    }

    socket.current?.on("active:user", (data) => setActiveUser(data));
  }, [user?.id]);

  return (
    <Context.Provider value={{ activeUser, socket }}>
      {children}
    </Context.Provider>
  );
};

export const useSocketProviderValue = () => {
  return useContext(Context);
};
