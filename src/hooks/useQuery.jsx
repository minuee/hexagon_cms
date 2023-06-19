import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import qs from "query-string";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentPage,currentPageName,currentFilterCategoryType,currentFilterUseType,currentFilterCategoryPk } from "../redux/state";

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
  const [wpage, setPage] = useRecoilState(currentPage);
  const [wpageName, setPageName] = useRecoilState(currentPageName);  
  const [use_type, setUseType] = useRecoilState(currentFilterUseType);
  const [category_type, setCategoryType] = useRecoilState(currentFilterCategoryType);
  const [category_pk, setCategoryPk] = useRecoilState(currentFilterCategoryPk);
  
  if( location.pathname !== wpageName ) {
    setPage(1);
  }else{
    if ( query.page != undefined ) {
      setPage(query.page);
      setUseType(query?.use_type)
      setCategoryType(query?.category_type)
      setCategoryPk(query?.category_pk)
    }
  }
  const [dataFunction, setDataFunction] = useState();

  function updateQuery(update) {
    if (!update.hasOwnProperty("page")) {      
      if( location.pathname == wpageName ) {            
        update.page = wpage;        
      }else{
        update.page = 1;        
        setPageName(location.pathname)
      }
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
    query.use_type,
    query.type,
    query.tab,
    query.order_status,
    query.is_superman,
    dataFunction,
  ]);

  return { query, updateQuery, getDataFunction, Pagination, SearchBox, FilterBox, FilterBox2, TermSearchBox };
};
