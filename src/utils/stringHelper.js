import queryString from "querystring";

const updateQuery = (props, newQuery) => {
  const path = props.location.pathname;
  let query = queryString.parse(props.location.search.substring(1));
  query = { ...query, ...newQuery};
  const qs = queryString.stringify(query);
  props.history.push(`${path}?${qs}`);
};

const getQuery = (props) => {
  const query = queryString.parse(props.location.search.substring(1));
  return query;
};

const getUrlWithSlash = (url) => {
  return window._.last(url) === "/" ? url : `${url ? url : ""}/`;
};

const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export {
  updateQuery,
  getQuery,
  validateEmail,
  getUrlWithSlash,
}
