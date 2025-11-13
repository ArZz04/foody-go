import { useEffect } from "react";
import type { DependencyList } from "react";

import type { ChatEntityType } from "@/types/chat";

export type FoodyRealtimeEvent =
  | {
      type: "incident";
      payload: {
        entityId: string;
        entityType: ChatEntityType;
        name: string;
        reference: string;
        message: string;
        priority?: boolean;
      };
    }
  | {
      type: "chat";
      payload: {
        entityId: string;
        entityType: ChatEntityType;
        name: string;
        reference?: string;
        message: string;
      };
    };

const CHANNEL_NAME = "foody-realtime";
const FALLBACK_EVENT = "foody:realtime";

let channel: BroadcastChannel | null = null;
let initialized = false;
const subscribers = new Set<(event: FoodyRealtimeEvent) => void>();

const notify = (event: FoodyRealtimeEvent) => {
  subscribers.forEach((handler) => handler(event));
};

const ensureChannel = () => {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  if ("BroadcastChannel" in window) {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (event) => notify(event.data as FoodyRealtimeEvent);
  } else {
    window.addEventListener(FALLBACK_EVENT, (event) => {
      notify((event as CustomEvent<FoodyRealtimeEvent>).detail);
    });
  }
};

export const emitFoodyEvent = (event: FoodyRealtimeEvent) => {
  if (typeof window === "undefined") return;
  ensureChannel();
  if (channel) {
    channel.postMessage(event);
  } else {
    window.dispatchEvent(new CustomEvent(FALLBACK_EVENT, { detail: event }));
  }
  notify(event);
};

export const subscribeFoodyEvents = (
  handler: (event: FoodyRealtimeEvent) => void,
) => {
  if (typeof window === "undefined") return () => {};
  ensureChannel();
  subscribers.add(handler);
  return () => {
    subscribers.delete(handler);
  };
};

export const useFoodyEvents = (
  handler: (event: FoodyRealtimeEvent) => void,
  deps: DependencyList = [],
) => {
  useEffect(() => subscribeFoodyEvents(handler), deps);
};
