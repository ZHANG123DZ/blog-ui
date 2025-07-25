import httpRequest from "../../utils/httpRequest";

export const getFollowers = async (data) => {
  const res = await httpRequest.get(
    `/follows/followed-by/${data.type}/${data.follow_able_id}`
  );
  return res;
};

export const getFollowing = async (data) => {
  const res = await httpRequest.get(
    `/follows/list/${data.type}/${data.userId}`
  );
  return res;
};

export const follow = async (data) => {
  const res = await httpRequest.post(
    `/follows/${data.type}/${data.follow_able_id}`,
    data
  );
  return res;
};

export const unfollow = async (data) => {
  const res = await httpRequest.del(
    `/follows/${data.type}/${data.follow_able_id}`
  );
  return res;
};

export const check = async (data) => {
  const res = await httpRequest.get(
    `/follows/check/${data.type}/${data.follow_able_id}`
  );
  return res;
};
export default { getFollowers, getFollowing, follow, unfollow, check };
