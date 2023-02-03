export default (form, state) => (path, value) => {
  if (path === 'rssForm.state') {
    const inputUrl = document.querySelector('.form-control');

    if (value === 'invalid') {
      inputUrl.classList.add('is-invalid');
    } else if (value === 'valid') {
      inputUrl.classList.remove('is-invalid');
      form.reset();
      inputUrl.focus();
      /* eslint-disable no-param-reassign */
      state.rssForm.state = 'filling';
    }
  }
};
