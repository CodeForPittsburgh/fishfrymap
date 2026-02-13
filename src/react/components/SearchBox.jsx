import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faMagnifyingGlass, faSpinner } from "../icons/fontAwesome";

const SearchBox = ({
  query,
  onQueryChange,
  suggestionsOpen,
  onSuggestionsOpen,
  fishSuggestions,
  placeSuggestions,
  onSelectSuggestion,
  isSearching
}) => {
  const hasResults = fishSuggestions.length > 0 || placeSuggestions.length > 0;
  const showMenu = suggestionsOpen && query.trim().length >= 3;

  return (
    <div className="form-group has-feedback fishfry-search">
      <input
        id="searchbox"
        type="text"
        placeholder="Search All Fish Fries"
        className="form-control"
        value={query}
        onChange={(event) => {
          onQueryChange(event.target.value);
          onSuggestionsOpen(true);
        }}
        onFocus={() => onSuggestionsOpen(true)}
        onBlur={() => {
          window.setTimeout(() => onSuggestionsOpen(false), 120);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
          }
        }}
      />
      <span id="searchicon" className="form-control-feedback">
        <FontAwesomeIcon icon={isSearching ? faSpinner : faMagnifyingGlass} spin={isSearching} />
      </span>

      {showMenu ? (
        <div className="tt-dropdown-menu fishfry-search__menu">
          {fishSuggestions.length > 0 ? <h4 className="typeahead-header">Fish Frys</h4> : null}
          {fishSuggestions.map((suggestion) => (
            <div
              key={`fish-${suggestion.id}`}
              className="tt-suggestion"
              onMouseDown={(event) => {
                event.preventDefault();
                onSelectSuggestion(suggestion);
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
                onSelectSuggestion(suggestion);
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
