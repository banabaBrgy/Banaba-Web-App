"use client";

import { pusherClient } from "@/lib/pusher";
import { Channel, Members } from "pusher-js";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface ActiveUserProviderProp {
  children: ReactNode;
}

interface ContextType {
  activeUser: string[];
}

const Context = createContext({} as ContextType);

export const ActiveUserProvider = ({ children }: ActiveUserProviderProp) => {
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [activeUser, setActiveUser] = useState<string[]>([]);

  useEffect(() => {
    let channel = activeChannel;

    if (!channel) {
      channel = pusherClient.subscribe("presence-messenger");
      setActiveChannel(channel);
    }

    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const initialMembers: string[] = [];

      members.each((member: Record<string, any>) =>
        initialMembers.push(member.id)
      );
      setActiveUser(initialMembers);
    });

    channel.bind("pusher:member_added", (member: Record<string, any>) => {
      setActiveUser((prev) =>
        !prev.includes(member.id) ? [...prev, member.id] : prev
      );
    });

    channel.bind("pusher:member_removed", (member: Record<string, any>) => {
      setActiveUser((prev) => prev.filter((user) => user !== member.id));
    });

    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe("presence-messenger");
        setActiveChannel(null);
      }
    };
  }, [activeChannel]);

  return <Context.Provider value={{ activeUser }}>{children}</Context.Provider>;
};

export function useActiveUserProviderValue() {
  return useContext(Context);
}
