import { handler } from './handler.js';

handler({}, {})
  .then((value) => console.log(value))
  .catch((error) => console.error(error));
