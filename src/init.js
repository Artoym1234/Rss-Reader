import onChange from 'on-change';
import i18n from 'i18next';
import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
import render from './render.js';
import ru from './locales/ru.js';
import validate from './validator.js';
import parseData from './parser.js';

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
  };

  const form = document.querySelector('.rss-form');

  const watchedState = onChange(state, render(form, state, i18nInstance));

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
              console.log(state.feeds);
              console.log(state.posts);
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
