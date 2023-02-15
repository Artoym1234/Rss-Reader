import onChange from 'on-change';
import i18n from 'i18next';
import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
import render from './render.js';
import ru from './locales/ru.js';
import validate from './validator.js';
import parseData from './parser.js';
import update from './updatePosts.js';

export default () => {
  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: 'ru',
    resources: {
      ru,
    },
  });

  const state = {
    fields: {
      urs: '',
    },
    rssForm: {
      state: 'filling',
      errors: {},
    },
    validUrls: [],
    feeds: [],
    posts: [],
    uiState: {
      selectPostId: null,
      readPost: 'noRead',
    },
  };

  const form = document.querySelector('.rss-form');
  const postsContainer = document.querySelector('.posts');

  const watchedState = onChange(state, render(form, state, i18nInstance));
  update(watchedState);

  postsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn')) {
      watchedState.uiState.selectPostId = e.target.dataset.id;
    }
    if (e.target.classList.contains('fw-bold')) {
      watchedState.uiState.readPost = 'yesRead';
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    watchedState.fields.url = formData.get('url');
    validate(state.fields, state.validUrls)
      .then(() => {
        watchedState.rssForm.errors = {};
        watchedState.rssForm.state = 'valid';
        const rssUrl = new URL(`https://allorigins.hexlet.app/get?disableCache=true&url=${watchedState.fields.url}`);
        axios.get(rssUrl.toString())
          .then((response) => {
            state.validUrls.push(state.fields.url);
            try {
              const responseDom = parseData(response.data.contents);
              const { feed, posts } = responseDom;
              watchedState.feeds.push(feed);
              posts.forEach((post) => {
                watchedState.posts.push({ id: uniqueId(), ...post });
              });
            } catch (err) {
              watchedState.rssForm.errors = 'validError';
            }
          })
          .catch(() => {
            watchedState.rssForm.errors = 'networkError';
          });
      })
      .catch((err) => {
        watchedState.rssForm.errors = err.message;
        watchedState.rssForm.state = 'invalid';
      });
  });
};
