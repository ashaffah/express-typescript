type PollState = {
  question: string;
  options: {
    id: number;
    text: string;
    description: string;
    votes: string[];
  }[];
};

type ClientToServerEvents = {
  vote: (optionId: number) => void;
  askForStateUpdate: () => void;
};

type ServerToClientEvents = {
  updateState: (state: PollState) => void;
};

type InterServerEvents = {};

type SocketData = {
  user: string;
};

export type {
  PollState,
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
};
