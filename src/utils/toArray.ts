import { UserInfo } from "../user";

export const toFilteredArray = (
  map: Map<String, UserInfo>,
  roomOrUsername: string,
  _room: boolean = true
) => {
  const array = [];
  for (const [id, { username, room }] of map) {
    if (_room && room === roomOrUsername) {
      array.push({
        id,
        username,
        room,
      });
    } else if (!_room && username === roomOrUsername) {
      array.push({
        id,
        username,
        room,
      });
    }
  }
  return array;
};
