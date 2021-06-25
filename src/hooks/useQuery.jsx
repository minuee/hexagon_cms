import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import qs from "query-string";

import {
  Pagination as SimplePagination,
  SearchBox as SimpleSearchBox,
  FilterBox as SimpleFilterBox,
  FilterBox2 as SimpleFilterBox2,
  TermSearchBox as SimpleTermSearchBox,
} from "components";

export const useQuery = (location) => {
  const query = qs.parse(location.search);
  const history = useHistory();

  const [dataFunction, setDataFunction] = useState();

  function updateQuery(update) {
    if (!update.hasOwnProperty("page")) {
      update.page = 1;
    }

    Object.assign(query, update);
    history.push(`${location.pathname}?` + qs.stringify(query));
  }
  function getDataFunction(func) {
    setDataFunction(() => func);
  }

  const Pagination = (props) => <SimplePagination page={query.page} setPage={updateQuery} {...props} />;
  const SearchBox = (props) => <SimpleSearchBox defaultValue={query.search_word} onSearch={updateQuery} {...props} />;
  const FilterBox = (props) => <SimpleFilterBox query={query} onQueryUpdate={updateQuery} {...props} />;
  const FilterBox2 = (props) => <SimpleFilterBox2 search_params={query} onFilter={updateQuery} {...props} />;
  const TermSearchBox = (props) => (
    <SimpleTermSearchBox
      term_start={query.term_start}
      term_end={query.term_end}
      onTermSearch={updateQuery}
      {...props}
    />
  );

  useEffect(() => {
    if (dataFunction) {
      dataFunction(query);
    }
  }, [
    query.page,
    query.search_word,
    query.sort_item,
    query.sort_type,
    query.filter_item,
    query.term_start,
    query.term_end,
    query.category_pk,
    query.type,
    query.tab,
    query.order_status,
    dataFunction,
  ]);

  return { query, updateQuery, getDataFunction, Pagination, SearchBox, FilterBox, FilterBox2, TermSearchBox };
};
