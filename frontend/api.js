import axios from 'axios';

const API_ENDPOINT = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_API_ENDPOINT : '';

export async function getData(state) {
  const { data } = await axios.get(`${API_ENDPOINT}/api/${state}`);
  return data;
}
