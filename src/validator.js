import * as yup from 'yup';

const validate = (input, watchedState) => {
  const refs = watchedState.feeds.map((feed) => feed.ref);
  const schema = yup.string().url().notOneOf(refs);
  return schema.validate(input);
};

export default validate;
