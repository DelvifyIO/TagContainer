const clientMapper = (datum) => {
  const {
    _id: id,
    name,
    website,
    createdAt,
  } = datum;

  return ({
    id,
    name,
    website,
    createdAt,
  })

};

export {
  clientMapper,
}
