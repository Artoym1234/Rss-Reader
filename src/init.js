import onChange from 'on-change';
import i18n from 'i18next';
import render from './render.js';
import ru from './locales/ru.js';
import validate from './validator.js';

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
        state.validUrls.push(state.fields.url);
      }).catch((err) => {
        watchedState.rssForm.errors = err.message;
        watchedState.rssForm.state = 'invalid';
      });
  });
};
