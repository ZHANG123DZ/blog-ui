import httpRequest from '../../utils/httpRequest';

export const getUser = async (userName) => {
  const res = await httpRequest.get(`/users/${userName}`);
  return res;
};

export default { getUser };
