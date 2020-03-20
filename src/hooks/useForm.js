import React, { useCallback, useState, useEffect } from 'react';

const useForm = ({ onSubmit, validator = () => {}, initialValues = {}, async = false }) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (async) {
      onSubmit(values, errors);
    }
  }, [values, errors]);

  const handleChange = useCallback((e) => {
    e.persist();
    const error = validator(e.target.name, e.target.value);
    if (e.target.options) {
      const options = e.target.options;
      const selecteds = window._.filter(options, (option) => option.selected).map((option) => option.value);
      setValues(values => ({
        ...values,
        [e.target.name]: e.target.dataset.single ? selecteds.join() : selecteds,
      }));
    }
    if (e.target.dataset.arrayname) {
      const splits = e.target.name.split('_');
      const name = e.target.dataset.arrayname;
      const index = splits[1];
      const tempArray = window._.clone(values[name]) || [];
      tempArray[index] = e.target.value === "" ? null : e.target.value;
      setValues(values => ({
        ...values,
        [name]: tempArray,
      }));
    } else {
      setValues(values => ({
        ...values,
        [e.target.name]: e.target.value,
      }));
    }
    const newErrors = error ? { ...errors, [e.target.name]: error } : window._.omit(errors, e.target.name);
    setErrors(newErrors);
  }, [values, errors]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const temp = window._.clone(values);
    window._.forEach(temp, (value, key) => {
      if (Array.isArray(value)) {
        for(let i = 0; i < Math.max(initialValues[key].length, value.length); i++) {
          temp[key][i] = value[i] === undefined ? initialValues[key][i] : value[i] ;
        }
        temp[key] = window._.filter(temp[key], (datum) => !window._.isEmpty(datum));
      }
    });
    onSubmit({ ...initialValues, ...temp }, errors);
  }, [values, errors, onSubmit, initialValues]);

  return {
    form: {
      handleChange,
      handleSubmit,
      values,
      errors,
    }
  }
};

export default useForm;
