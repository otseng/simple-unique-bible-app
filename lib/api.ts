import axios from 'axios'
import useSWR from 'swr'
import { API_SERVER } from './constants';

const auth = {
  username: 'ubaclient',
  password: 'uniquebibleapp'
}

export function getBibles() {
  
  const address = API_SERVER + '/bible';
  const fetcher = async (url) => await axios.get(url, {auth}).then((res) => res.data.data);
  const { data, error } = useSWR(address, fetcher);

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getBibleBooks() {
  const address = API_SERVER + '/data/bible/abbreviations?lang=eng';
  const fetcher = async (url) => await axios.get(url, {auth}).then((res) => res.data.data);
  const { data, error } = useSWR(address, fetcher);

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getBibleChapter(text, bookNumber, chapter) {
  const address = API_SERVER + `/bible/${text}/${bookNumber}/${chapter}`;
  const fetcher = async (url) => await axios.get(url, {auth}).then((res) => res.data.data);
  const { data, error } = useSWR(address, fetcher);

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getBooks() {
  
  const address = API_SERVER + '/book';
  const fetcher = async (url) => await axios.get(url, {auth}).then((res) => res.data.data);
  const { data, error } = useSWR(address, fetcher);

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getBookChapters(title) {
  
  if (title) {
    title = title.replaceAll(' ', '+')
  }
  const address = API_SERVER + `/book/${title}`;
  const fetcher = async (url) => await axios.get(url, {auth}).then((res) => res.data.data);
  const { data, error } = useSWR(address, fetcher);

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getBookChapterContent(title, chapter) {
  
  if (title) {
    title = title.replaceAll('%20', '+').replaceAll(' ', '+')
    chapter = chapter.replaceAll('%20', '+').replaceAll(' ', '+')
  }
  const address = API_SERVER + `/book/${title}/${chapter}`;
  const fetcher = async (url) => await axios.get(url, {auth}).then((res) => res.data.data);
  const { data, error } = useSWR(address, fetcher);

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getCommentaries() {
  
  const address = API_SERVER + '/commentary';
  const fetcher = async (url) => await axios.get(url, {auth}).then((res) => res.data.data);
  const { data, error } = useSWR(address, fetcher);

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getCommentaryContent(title, bookNumber, chapter) {
  
  const address = API_SERVER + `/commentary/${title}/${bookNumber}/${chapter}`;
  const fetcher = async (url) => await axios.get(url, {auth}).then((res) => res.data.data);
  const { data, error } = useSWR(address, fetcher);

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

