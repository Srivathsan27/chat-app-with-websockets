import { toFilteredArray } from "./utils/toArray";

export type UserInfo = {
  username: string;
  room: string;
};

const users = new Map<String, UserInfo>();

export const userJoin = (id: string, username: string, room: string) => {
  if (toFilteredArray(users, username, false).length > 0) {
    return;
  }
  users.set(id, { username, room });
};

export const getUser = (id: string) => {
  const user = users.get(id);
  if (!user) {
    return null;
  } else {
    return {
      id,
      username: user.username,
      room: user.room,
    };
  }
};

export const getUsersInRoom = (room: string) => {
  return toFilteredArray(users, room);
};

export const userLeave = (id: string) => {
  return users.delete(id);
};
