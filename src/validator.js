import { setLocale } from 'yup';
import * as yup from 'yup';

setLocale({
  string: {
    url: ('not_ValidUrl'),
  },
  mixed: {
    notOneOf: ('not_uniq'),
  },
});

const validate = (fields, validUrls) => {
  const schema = yup.object().shape({
    url: yup.string().url().nullable().notOneOf(validUrls),
  });

  return schema.validate(fields);
};

export default validate;
