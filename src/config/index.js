import _ from 'lodash';
import Promise from 'bluebird';
import Api from '../utils/api';

const config = () => {
  global._ = _;
  global.api = new Api({});
  global.Promise = Promise;
  Promise.config({
    warnings: false,
    longStackTraces: false,
  });
  global.FETCH_LIMIT = 10;
};

export default config();
