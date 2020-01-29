import React, { useState, useCallback, useEffect } from 'react';
import moment from 'moment';
import {getQuery, updateQuery} from "../utils/stringHelper";

const useDataFetch = (props, url, params, options = {}, format) => {
  const query = getQuery(props);

  const [data, setData] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(parseInt(query.p) || 1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [page]);

  const goToPage = useCallback((page) => {
    setPage(page);
    updateQuery(props, { p: page });
  }, [props]);

  const fetchData = useCallback((addParams) => {
    setLoading(true);
    return window.api.get(url, { params: {
        limit: window.FETCH_LIMIT || options.limit,
        offset: window.FETCH_LIMIT * (page - 1) || options.offset,
        sortBy: options.sortBy,
        order: options.order,
        ...params,
        ...addParams,
      }})
      .then((res) => {
        const { total, rows } = res;
        const formattedResult = rows.map(format);
        setTotalPage(Math.max(1, Math.ceil(total / window.FETCH_LIMIT)));
        setData(formattedResult);
        setLoading(false);
        return Promise.resolve(formattedResult);
      }).catch((error) => {
        setTotalPage(1);
        setData([]);
        setLoading(false);
        return Promise.reject(error);
      });
  }, [page]);

  return {
    page,
    goToPage,
    totalPage,
    data,
    fetchData,
    loading,
  }
};

export default useDataFetch;
