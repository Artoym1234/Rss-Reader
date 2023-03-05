import onChange from 'on-change';
import i18n from 'i18next';
import uniqueId from 'lodash/uniqueId.js';
import { setLocale } from 'yup';
import * as yup from 'yup';
import axios from 'axios';
import render from './render.js';
import ru from './locales/ru.js';
import parseData from './parser.js';
import './styles.css';
import 'bootstrap';

const validate = (input, watchedState) => {
  const refs = watchedState.feeds.map((feed) => feed.url);
  const schema = yup.string().url().notOneOf(refs);
  return schema.validate(input);
};

const getResponse = (url) => {
  const proxyUrl = new URL('https://allorigins.hexlet.app/get');
  proxyUrl.searchParams.append('disableCache', 'true');
  proxyUrl.searchParams.append('url', url);
  return axios.get(proxyUrl);
};

const updateFeeds = (state) => {
  const feedsLinks = state.feeds.filter((onlyRef) => onlyRef.url);
  const requests = feedsLinks.map((feed) => getResponse(feed.url));

  Promise.all(requests)
    .then((responses) => {
      responses.forEach((response) => {
        const responseDom = parseData(response.data.contents);
        const { posts } = responseDom;
        posts.forEach((post) => {
          const newLinks = state.posts.map((loadedPost) => loadedPost.link);
          if (!newLinks.includes(post.link)) {
            state.posts.push(post);
          }
        });
      });
    })
    .finally(() => setTimeout(() => updateFeeds(state), 5000));
};

export default () => {
  const state = {
    rssForm: {
      state: '',
      errors: '',
    },
    feeds: [],
    posts: [],
    uiState: {
      selectPostId: null,
      viewedPostIds: new Set(),
    },
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    postsContainer: document.querySelector('.posts'),
    inputUrl: document.querySelector('.form-control'),
    feedback: document.querySelector('.feedback'),
    submit: document.querySelector("[type='submit']"),
    feedsColumn: document.querySelector('.feeds'),
    postsColumn: document.querySelector('.posts'),
    modalTitle: document.querySelector('.modal-title'),
    modalDescription: document.querySelector('.modal-body'),
    modalLink: document.querySelector('.modal-footer a'),
  };

  const i18nInstance = i18n.createInstance();
  i18nInstance
    .init({
      lng: 'ru',
      resources: {
        ru,
      },
    })
    .then(() => {
      setLocale({
        string: {
          url: ('not_ValidUrl'),
        },
        mixed: {
          notOneOf: ('not_uniq'),
        },
      });

      const watchedState = onChange(state, render(elements, state, i18nInstance));

      updateFeeds(watchedState);

      elements.postsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn')) {
          watchedState.uiState.selectPostId = e.target.dataset.id;
        }
        if (e.target.classList.contains('fw-bold')) {
          watchedState.uiState.viewedPostIds.add(e.target.dataset.id);
        }
      });

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url');

        validate(url, state)
          .then(() => {
            watchedState.rssForm.state = 'filling';
            return getResponse(url);
          })
          .then((response) => {
            const responseDom = parseData(response.data.contents);
            const { feed, posts } = responseDom;
            posts.forEach((post) => {
              watchedState.posts.push({ id: uniqueId(), ...post });
            });
            watchedState.feeds.push({ url, ...feed });
            watchedState.rssForm.state = 'received';
          })
          .catch((error) => {
            watchedState.rssForm.state = 'failed';
            switch (true) {
              case error.name === 'ValidationError':
                watchedState.rssForm.errors = error.message;
                break;
              case error.name === 'AxiosError':
                watchedState.rssForm.errors = 'networkError';
                break;
              case error.isParsingError:
                watchedState.rssForm.errors = 'parseError';
                break;
              default:
                state.rssForm.errors = 'unknownError';
                break;
            }
          });
      });
    });
};
