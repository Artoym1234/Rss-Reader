import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import isEmpty from 'lodash/isEmpty.js';

const schema = yup.object().shape({
  website: string().url().nullable(),
});

const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return keyBy(e.inner, 'path');
  }
};

const validFormUrlInput = () => {
  const state = {
    registrationForm: {
      data: {
        url: '',
      },
      errors: {},
      submitIsValid: false,
      valid: true,
      processState: 'filling',
      processError: null,
    },
  };

  const urlInput = document.querySelector('#url-input');
  const watchedState = onChange(state, (path, value) => {
    urlInput.addEventListener('input', (event) => {
      watchedState.registrationForm.data[event.target.aria-label] = event.target.value;
      console.log('event.target.value');
      watchedState.registrationForm.errors = validate(watchedState.registrationForm.data);
      watchedState.registrationForm.submitIsValid = !!isEmpty(watchedState.registrationForm.valid);
    });
  });
};
