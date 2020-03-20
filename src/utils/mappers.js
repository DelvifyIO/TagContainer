import {TAG_STATUS} from "./enums";

const clientMapper = (datum) => {
  const {
    _id: id,
    name,
    websites,
    createdAt,
    tags,
    status,
  } = datum;

  return ({
    id,
    name,
    websites,
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
