import { createContext } from "react";

const mockUserData = {
  token: "mock-token",
  user: {
    name: "Guest User",
    email: "guest@example.com",
    imageUrl: "https://via.placeholder.com/40",
  },
  loader: 0
};

const mockContext = {
  userData: mockUserData,
  setUserData: () => {},
  setMessage: () => {},
  setOpen: () => {}
};

export default createContext(mockContext);
