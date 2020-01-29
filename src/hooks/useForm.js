import React, { useCallback, useState, useEffect } from 'react';

const useForm = ({ onSubmit, validator = () => {}, async = false }) => {
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
      setValues(values => ({
        ...values,
        [e.target.name]: window._.filter(options, (option) => option.selected).map((option) => option.value),
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
    onSubmit(values, errors);
  }, [values, errors]);

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
