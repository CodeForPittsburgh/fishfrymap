import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { faMagnifyingGlass, faSpinner } from "@/icons/fontAwesome";
import { searchActions } from "@/store/slices/searchSlice";
import { handleSuggestionSelected } from "@/store/thunks/searchThunks";
import "./SearchBox.css";

const SearchBox = ({ fishSuggestions, placeSuggestions, isSearching }) => {
  const dispatch = useDispatch();
  const query = useSelector((state) => state.search.query);
  const suggestionsOpen = useSelector((state) => state.search.suggestionsOpen);

  const hasResults = fishSuggestions.length > 0 || placeSuggestions.length > 0;
  const showMenu = suggestionsOpen && query.trim().length >= 3;

  return (
    <div className="fishfry-search">
      <InputGroup>
        <Form.Control
          id="searchbox"
          type="text"
          placeholder="Search All Fish Fries"
          value={query}
          onChange={(event) => {
            dispatch(searchActions.setQuery(event.target.value));
            dispatch(searchActions.setSuggestionsOpen(true));
          }}
          onFocus={() => dispatch(searchActions.setSuggestionsOpen(true))}
          onBlur={() => {
            window.setTimeout(() => dispatch(searchActions.setSuggestionsOpen(false)), 120);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
            }
          }}
        />
        <InputGroup.Text id="searchicon">
          <FontAwesomeIcon icon={isSearching ? faSpinner : faMagnifyingGlass} spin={isSearching} />
        </InputGroup.Text>
      </InputGroup>

      {showMenu ? (
        <div className="tt-dropdown-menu fishfry-search__menu">
          {fishSuggestions.length > 0 ? <h4 className="typeahead-header">Fish Frys</h4> : null}
          {fishSuggestions.map((suggestion) => (
            <div
              key={`fish-${suggestion.id}`}
              className="tt-suggestion"
              onMouseDown={(event) => {
                event.preventDefault();
                dispatch(handleSuggestionSelected(suggestion));
              }}
            >
              {suggestion.name}
              <br />
              <small>{suggestion.address}</small>
            </div>
          ))}

          {placeSuggestions.length > 0 ? <h4 className="typeahead-header">Places</h4> : null}
          {placeSuggestions.map((suggestion, index) => (
            <div
              key={`map-${index}`}
              className="tt-suggestion"
              onMouseDown={(event) => {
                event.preventDefault();
                dispatch(handleSuggestionSelected(suggestion));
              }}
            >
              {suggestion.name}
            </div>
          ))}

          {!hasResults ? <div className="tt-suggestion">No results</div> : null}
        </div>
      ) : null}
    </div>
  );
};

export default SearchBox;
