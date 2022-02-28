import moment from "moment";

export const formatData = (
  username: string,
  message: string,
  room?: string
) => {
  return {
    username,
    message,
    room,
    time: moment().format("h:mm a"),
  };
};
