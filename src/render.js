export default (form, state, i18nInstance) => (path, value) => {
  if (path !== 'rssForm.state') { return; }

  const inputUrl = document.querySelector('.form-control');
  const feedback = document.querySelector('.feedback');

  if (value === 'invalid') {
    inputUrl.classList.add('is-invalid');
    feedback.textContent = i18nInstance.t('not_ValidUrl');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    feedback.textContent = state.validUrls.includes(state.fields.url) ? i18nInstance.t('not_uniq') : i18nInstance.t('not_ValidUrl');
  } else if (value === 'valid') {
    inputUrl.classList.remove('is-invalid');
    form.reset();
    inputUrl.focus();
    feedback.textContent = i18nInstance.t('success');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    /* eslint-disable no-param-reassign */
    state.rssForm.state = 'filling';
  }
};
// text-success
// text-danger
// massiv.includes(333)
