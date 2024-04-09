import { create } from "zustand";
import { Thread, parseThreadsInPage } from "../domains/thread";
import { subscribeWithSelector } from "zustand/middleware";
import { parseUsersInPage } from "../domains/user";

export type MVIgnitedStore = {
  forumsLastVisited: string[];
  usersIgnored: string[];
  threadsIgnored: string[];
  dataCache: {
    favorites: Thread[];
    lastThreads: Thread[];
    lastNews: Thread[];
    userLastPosts: Thread[];
  };
  customFont?: string;
};

const MEDIAVIDA_KEY = "mv-ignited::store";

const storeSet = (data: MVIgnitedStore) => {
  localStorage.setItem(MEDIAVIDA_KEY, JSON.stringify(data));
};

const storeGet = (): MVIgnitedStore | void => {
  const saved = localStorage.getItem(MEDIAVIDA_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
};

export type MVIgnitedStoreState = MVIgnitedStore & {
  update: <K extends keyof MVIgnitedStore>(
    key: K,
    data: MVIgnitedStore[K]
  ) => void;
};

export const useStore = create(
  subscribeWithSelector<MVIgnitedStoreState>((set) => ({
    usersIgnored: [],
    threadsIgnored: [],
    forumsLastVisited: [],
    dataCache: {
      favorites: [],
      lastThreads: [],
      lastNews: [],
      userLastPosts: [],
    },
    ...(storeGet() ?? {}),
    update: (key, data) =>
      set(() => {
        return { [key]: data };
      }),
  }))
);

useStore.subscribe(
  (state) => state,
  (state) => {
    console.log("MV-Ignited🔥 state change:", state);
    storeSet(state);
  },
);

useStore.subscribe(
  (state) => state.threadsIgnored,
  () => {
    parseThreadsInPage();
  },
);

useStore.subscribe(
  (state) => state.usersIgnored,
  () => {
    parseUsersInPage();
  },
);
