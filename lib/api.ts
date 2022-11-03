import axios from 'axios'
import useSWR from 'swr'
import { API_SERVER } from './constants';

export function getBibles() {
  const address = API_SERVER + '/bible';
  const fetcher = async (url) => await axios.get(url).then((res) => res.data.data);
  const { data, error } = useSWR(address, fetcher);

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getBibleBooks() {
  const address = API_SERVER + '/data/bible/abbreviations?lang=eng';
  const fetcher = async (url) => await axios.get(url).then((res) => res.data.data);
  const { data, error } = useSWR(address, fetcher);

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

