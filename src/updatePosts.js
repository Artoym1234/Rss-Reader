import parseData from './parser';
import getData from './routes.js';

const update = (state) => {
  const feedsLinks = state.feeds.filter((onlyLink) => onlyLink.ref);
  const requests = feedsLinks.map((feed) => getData(feed.ref));

  Promise.all(requests).then((responses) => {
    responses.forEach((response) => {
      const responseDom = parseData(response.data.contents);
      const { posts } = responseDom;
      posts.forEach((post) => {
        const newLinks = state.posts.map((loadedPost) => loadedPost.link);
        if (!newLinks.includes(post.link)) {
          state.posts.push(post);
        }
      });
    });
    setTimeout(() => update(state), 5000);
  });
};

export default update;
