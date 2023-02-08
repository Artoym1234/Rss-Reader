import axios from 'axios';
import parseData from './parser';

const update = (state) => {
  state.validUrls.forEach((url) => {
    const rssUrl = new URL(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`);
    axios.get(rssUrl)
      .then((response) => {
        const responseDom = parseData(response.data.contents);
        const { posts } = responseDom;
        console.log(posts);
        posts.forEach((post) => {
          const newLinks = state.posts.map((loadedPost) => loadedPost.link);
          if (!newLinks.includes(post.link)) {
            state.posts.push(post);
          }
        });
      });
  });

  setTimeout(() => update(state), 5000);
};

export default update;
