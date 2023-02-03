import * as yup from 'yup';
import onChange from 'on-change';
import render from './render.js';

export default () => {
  const state = {
    fields: {
      url: '',
    },
    rssForm: {
      state: 'filling',
      errors: {},
    },
    validUrls: [],
  };

  const form = document.querySelector('.rss-form');

  const watchedState = onChange(state, render(form, state));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    watchedState.fields.url = formData.get('url');

    const schema = yup.object().shape({
      url: yup.string().url().nullable().notOneOf(state.validUrls),
    });
    schema.validate(watchedState.fields).then(() => {
      state.validUrls.push(state.fields.url);
      watchedState.rssForm.state = 'valid';
    }).catch((err) => {
      watchedState.rssForm.errors = err;
      watchedState.rssForm.state = 'invalid';
    });
  });
};
