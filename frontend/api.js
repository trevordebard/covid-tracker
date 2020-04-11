import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_API_URL : '';

export async function getData(state) {
  const { data } = await axios.get(`${API_URL}/api/${state}`);
  return data;
}

export async function getHistory(state) {
  let { data } = await axios.get(`${API_URL}/api/history?state=${state}`);
  data = data.map(element => ({ ...element, recent: new Date(element.recent) }));
  data = data.sort((a, b) => a.recent - b.recent);
  data = data.map(element => ({ ...element, recent: `${element.recent.getMonth() + 1}/${element.recent.getDate()}` }));
  return data;
}
