import cors from "cors";
import express from "express";
import { Server, Socket } from "socket.io";

type PollState = {
  question: string;
  options: {
    id: number;
    text: string;
    description: string;
    votes: string[];
  }[];
};
interface ClientToServerEvents {
  vote: (optionId: number) => void;
  askForStateUpdate: () => void;
}
interface ServerToClientEvents {
  updateState: (state: PollState) => void;
}
interface InterServerEvents {}
interface SocketData {
  user: string;
}

const app = express();
app.use(cors({ origin: "http://localhost:5173" })); // this is the default port that Vite runs your React app on
const server = require("http").createServer(app);
// passing these generic type parameters to the `Server` class
// ensures data flowing through the server are correctly typed.
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// this is middleware that Socket.IO uses on initiliazation to add
// the authenticated user to the socket instance. Note: we are not
// actually adding real auth as this is beyond the scope of the tutorial
io.use(addUserToSocketDataIfAuthenticated);

// the client will pass an auth "token" (in this simple case, just the username)
// to the server on initialize of the Socket.IO client in our React App
async function addUserToSocketDataIfAuthenticated(
  socket: Socket,
  next: (err?: Error) => void
) {
  const user = socket.handshake.auth.token;
  if (user) {
    try {
      socket.data = { ...socket.data, user: user };
    } catch (err) {}
  }
  next();
}

// the server determines the PollState object, i.e. what users will vote on
// this will be sent to the client and displayed on the front-end
const poll: PollState = {
  question: "What are eating for lunch ✨ Let's order",
  options: [
    {
      id: 1,
      text: "Party Pizza Place",
      description: "Best pizza in town",
      votes: [],
    },
    {
      id: 2,
      text: "Best Burger Joint",
      description: "Best burger in town",
      votes: [],
    },
    {
      id: 3,
      text: "Sus Sushi Place",
      description: "Best sushi in town",
      votes: [],
    },
  ],
};

io.on("connection", (socket) => {
  console.log("a user connected", socket.data.user);

  // the client will send an 'askForStateUpdate' request on mount
  // to get the initial state of the poll
  socket.on("askForStateUpdate", () => {
    console.log("client asked For State Update");
    socket.emit("updateState", poll);
  });

  socket.on("vote", (optionId: number) => {
    // If user has already voted, remove their vote.
    poll.options.forEach((option) => {
      option.votes = option.votes.filter((user) => user !== socket.data.user);
    });
    // And then add their vote to the new option.
    const option = poll.options.find((o) => o.id === optionId);
    if (!option) {
      return;
    }
    option.votes.push(socket.data.user);
    // Send the updated PollState back to all clients
    io.emit("updateState", poll);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(8000, () => {
  console.log("listening on *:8000");
});
