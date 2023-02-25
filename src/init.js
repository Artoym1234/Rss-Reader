import onChange from 'on-change';
import i18n from 'i18next';
import uniqueId from 'lodash/uniqueId.js';
import { setLocale } from 'yup';
import getData from './routes.js';
import render from './render.js';
import ru from './locales/ru.js';
import validate from './validator.js';
import parseData from './parser.js';
import update from './updatePosts.js';
import './styles.css';
import 'bootstrap';

export default () => {
  const state = {
    rssForm: {
      state: 'filling',
      errors: {},
    },
    feeds: [],
    posts: [],
    uiState: {
      selectPostId: null,
      readPost: 'noRead',
    },
  };

  const form = document.querySelector('.rss-form');
  const postsContainer = document.querySelector('.posts');

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
      const watchedState = onChange(state, render(form, state, i18nInstance));

      update(watchedState);

      postsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn')) {
          watchedState.uiState.selectPostId = e.target.dataset.id;
        }
        if (e.target.classList.contains('fw-bold')) {
          watchedState.uiState.readPost = e.target.dataset.id;
        }
      });
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url');
        validate(url, state)
          .then(() => getData(url))
          .then((response) => {
            const responseDom = parseData(response.data.contents);
            const { feed, posts } = responseDom;
            watchedState.feeds.push(feed);
            posts.forEach((post) => {
              watchedState.posts.push({ id: uniqueId(), ...post });
            });
            state.feeds.push({ ref: url });
            watchedState.rssForm.state = 'valid';
          })
          .catch((error) => {
            switch (true) {
              case error.name === 'ValidationError':
                watchedState.rssForm.state = 'failed';
                watchedState.rssForm.errors = error.message;
                break;
              case error.name === 'AxiosError':
                watchedState.rssForm.state = 'failed';
                watchedState.rssForm.errors = 'networkError';
                break;
              case error.isParsingError:
                watchedState.rssForm.state = 'failed';
                watchedState.rssForm.errors = 'parseError';
                break;
              default:
                watchedState.rssForm.state = 'failed';
                state.rssForm.errors = 'unknownError';
                console.log(state.rssForm.errors);
                break;
            }
          });
      });
    });
};
