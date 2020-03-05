import {TAG_STATUS} from "./enums";

const clientMapper = (datum) => {
  const {
    _id: id,
    name,
    website,
    createdAt,
    tags,
    status = TAG_STATUS.LOADING,
  } = datum;

  return ({
    id,
    name,
    website,
    createdAt,
    tags,
    status,
  })

};

const tagMapper = (datum) => {
  const {
    _id: id,
    name,
    path = '',
    script,
    delay = 0,
  } = datum;

  return ({
    id,
    path,
    script,
    name,
    delay
  })
};

export {
  clientMapper,
  tagMapper,
}
