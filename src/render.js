export default (form, state, i18nInstance) => (path, value) => {
  // if (path !== 'rssForm.state') { return; }

  const inputUrl = document.querySelector('.form-control');
  const feedback = document.querySelector('.feedback');
  const feedsColumn = document.querySelector('.feeds');
  const postsColumn = document.querySelector('.posts');

  if (value === 'invalid') {
    inputUrl.classList.add('is-invalid');
    feedback.textContent = i18nInstance.t('not_ValidUrl');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    feedback.textContent = state.validUrls.includes(state.fields.url) ? i18nInstance.t('not_uniq') : i18nInstance.t('not_ValidUrl');
  }
  if (value === 'valid') {
    inputUrl.classList.remove('is-invalid');
    form.reset();
    inputUrl.focus();
    feedback.textContent = i18nInstance.t('success');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    /* eslint-disable no-param-reassign */
    state.rssForm.state = 'filling';
  }
  if (path === 'feeds') {
    const container = document.createElement('div');
    container.classList.add('card', 'border-0');
    const containerForFeed = document.createElement('div');
    containerForFeed.classList.add('card-body');
    containerForFeed.innerHTML = `<h2 class="card-title h4">${i18nInstance.t('title_for_feed')}</h2>`;
    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');
    value.forEach((feed) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'border-0', 'border-end-0');
      li.innerHTML = `<h3 class="h6 m-0">${feed.title}</h3><p class="m-0 small text-black-50"s>${feed.description}</p>`;
      ul.append(li);
    });
    container.prepend(containerForFeed);
    container.append(ul);
    feedsColumn.innerHTML = '';
    feedsColumn.prepend(container);
  }

  if (path === 'posts') {
    const container = document.createElement('div');
    container.classList.add('card', 'border-0');
    const containerForPost = document.createElement('div');
    containerForPost.classList.add('card-body');
    containerForPost.innerHTML = `<h2 class="card-title h4">${i18nInstance.t('title_for_post')}</h2>`;
    container.append(containerForPost);
    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');
    value.forEach((post) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      const a = document.createElement('a');
      a.setAttribute('href', post.link);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      a.classList.add('fw-bold');
      a.textContent = post.title;
      li.append(a);
      ul.append(li);
      container.append(ul);
    });
    postsColumn.innerHTML = '';
    postsColumn.prepend(container);
  }
};
