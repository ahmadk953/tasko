declare global {
  interface Liveblocks {
    Presence: {
      cursor: { x: number; y: number } | null;
    };

    UserMeta: {
      id: string;
      info: {
        name: string;
        avatar: string;
      };
    };
  }
}

export {};
