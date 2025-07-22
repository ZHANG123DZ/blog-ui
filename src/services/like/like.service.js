import httpRequest from "../../utils/httpRequest";

export const getLikes = async (data) => {
  const res = await httpRequest.get(
    `/likes/liked-by/${data.type}/${data.like_able_id}`
  );
  return res;
};

export const getLikedUserId = async (data) => {
  const res = await httpRequest.get(
    `/likes/list/${data.type}/${data.like_able_id}`
  );
  return res;
};

export const like = async (data) => {
  const res = await httpRequest.post(
    `/likes/${data.type}/${data.like_able_id}`,
    data
  );
  return res;
};

export const unlike = async (data) => {
  const res = await httpRequest.del(`/likes/${data.type}/${data.like_able_id}`);
  return res;
};

export const check = async (data) => {
  const res = await httpRequest.get(
    `/likes/check/${data.type}/${data.like_able_id}`
  );
  return res;
};
export default { getLikes, getLikedUserId, like, unlike, check };
