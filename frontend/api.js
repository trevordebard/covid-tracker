import axios from 'axios';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || 'http://167.172.224.227:2093/api';

export async function getData(state) {
  const { data } = await axios.get(`${API_ENDPOINT}/${state}`);
  return data;
}
