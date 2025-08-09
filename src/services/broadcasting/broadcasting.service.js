import httpRequest from "../../utils/httpRequest";

export const join = async (data) => {
  const res = await httpRequest.post(`/broadcasting/auth`, data);
  return res;
};

export default {
  join,
};
