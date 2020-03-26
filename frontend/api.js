import axios from 'axios';

const API_ENDPOINT =
  process.env.REACT_APP_API_ENDPOINT || 'http://167.172.224.227/api';

export async function getData(state) {
  return await (await axios.get(`${API_ENDPOINT}/${state}`)).data;
}