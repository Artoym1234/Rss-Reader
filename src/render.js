const inputUrl = document.querySelector('.form-control');
const feedback = document.querySelector('.feedback');
const feedsColumn = document.querySelector('.feeds');
const postsColumn = document.querySelector('.posts');
const modalTitle = document.querySelector('.modal-title');
const modalDescription = document.querySelector('.modal-body');
const modalLink = document.querySelector('.modal-footer a');

const renderForm = (form, i18nInstance, value) => {
  if (value === 'valid') {
    inputUrl.classList.remove('is-invalid');
    form.reset();
    inputUrl.focus();
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = i18nInstance.t('success');
  }
};

const renderErrors = (i18nInstance, value) => {
  switch (value) {
    case 'not_ValidUrl':
      inputUrl.classList.add('is-invalid');
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      feedback.textContent = i18nInstance.t('not_ValidUrl');
      break;
    case 'not_uniq':
      inputUrl.classList.add('is-invalid');
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      feedback.textContent = i18nInstance.t('not_uniq');
      break;
    case 'networkError':
      feedback.textContent = '';
      feedback.classList.add('text-danger');
      feedback.textContent = i18nInstance.t('networkError');
      break;
    case 'parseError':
      feedback.textContent = '';
      feedback.classList.add('text-danger');
      feedback.textContent = i18nInstance.t('parseError');
      break;
    default:
      throw new Error(`Unknown value: ${value}`);
  }
};

const renderFeeds = (i18nInstance, value) => {
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
    const feedTitle = document.createElement('h3');
    feedTitle.classList.add('h6', 'm-0');
    feedTitle.textContent = feed.title;

    const feedDescription = document.createElement('p');
    feedDescription.classList.add('m-0', 'small', 'text-black-50');
    feedDescription.textContent = feed.description;

    li.append(feedTitle, feedDescription);
    ul.append(li);
  });
  container.prepend(containerForFeed);
  container.append(ul);
  feedsColumn.innerHTML = '';
  feedsColumn.prepend(container);
};

const renderPosts = (i18nInstance, value) => {
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
    const button = document.createElement('button');
    button.setAttribute('data-id', post.id);
    button.textContent = i18nInstance.t('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    a.setAttribute('data-id', post.id);
    a.setAttribute('href', post.link);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.classList.add('fw-bold');
    a.textContent = post.title;
    li.append(a);
    ul.append(li);
    li.append(button);
    container.append(ul);
  });
  postsColumn.innerHTML = '';
  postsColumn.prepend(container);
};

const renderUiStatePostId = (state, value) => {
  const link = document.querySelector('.fw-bold');
  const selectPost = state.posts.filter((post) => post.id === value);
  modalTitle.textContent = selectPost[0].title;
  modalDescription.textContent = selectPost[0].description;
  modalLink.setAttribute('href', selectPost[0].link);
  link.classList.add('link-secondary', 'fw-normal');
  link.classList.remove('fw-bold');
};

const renderUiStateReadPost = (state, value) => {
  const link = document.querySelector('.fw-bold');
  state.posts.forEach((post) => {
    if (post.id === value) {
      link.classList.add('fw-normal', 'link-secondary');
      link.classList.remove('fw-bold');
    }
  });
};

export default (form, state, i18nInstance) => (path, value) => {
  switch (path) {
    case 'rssForm.state':
      renderForm(form, i18nInstance, value);
      break;
    case 'rssForm.errors':
      renderErrors(i18nInstance, value);
      break;
    case 'feeds':
      renderFeeds(i18nInstance, value);
      break;
    case 'posts':
      renderPosts(i18nInstance, value);
      break;
    case 'uiState.selectPostId':
      renderUiStatePostId(state, value);
      break;
    case 'uiState.readPost':
      renderUiStateReadPost(state, value);
      break;
    default:
      throw new Error(`Unknown path: ${value}`);
  }
};
