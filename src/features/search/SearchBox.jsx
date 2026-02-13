import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown, Form, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { faMagnifyingGlass, faSpinner } from "@/icons/fontAwesome";
import { searchActions } from "@/store/slices/searchSlice";
import { handleSuggestionSelected } from "@/store/thunks/searchThunks";
import "./SearchBox.css";

const MAX_VISIBLE_SUGGESTIONS = 6;

const SearchBox = ({ fishSuggestions, placeSuggestions, isSearching }) => {
  const dispatch = useDispatch();
  const query = useSelector((state) => state.search.query);
  const suggestionsOpen = useSelector((state) => state.search.suggestionsOpen);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [menuMaxHeight, setMenuMaxHeight] = React.useState(null);
  const menuRef = React.useRef(null);

  const hasResults = fishSuggestions.length > 0 || placeSuggestions.length > 0;
  const showMenu = suggestionsOpen && query.trim().length >= 3;
  const suggestions = React.useMemo(
    () => [
      ...fishSuggestions.map((suggestion) => ({ key: `fish-${suggestion.id}`, suggestion })),
      ...placeSuggestions.map((suggestion, index) => ({ key: `map-${index}`, suggestion })),
    ],
    [fishSuggestions, placeSuggestions]
  );
  const activeSuggestion = activeIndex >= 0 ? suggestions[activeIndex] : null;

  React.useEffect(() => {
    if (!showMenu || suggestions.length === 0) {
      setActiveIndex(-1);
      return;
    }

    setActiveIndex((currentActive) => (currentActive < suggestions.length ? currentActive : -1));
  }, [showMenu, suggestions.length]);

  React.useEffect(() => {
    if (!showMenu) {
      setMenuMaxHeight(null);
      return;
    }

    const menuElement = menuRef.current;

    if (!menuElement) {
      return;
    }

    const suggestionElements = menuElement.querySelectorAll('[data-search-suggestion="true"]');

    if (suggestionElements.length === 0) {
      setMenuMaxHeight(null);
      return;
    }

    const visibleSuggestionCount = Math.min(MAX_VISIBLE_SUGGESTIONS, suggestionElements.length);
    const lastVisibleSuggestion = suggestionElements[visibleSuggestionCount - 1];
    const menuStyles = window.getComputedStyle(menuElement);
    const paddingBottom = Number.parseFloat(menuStyles.paddingBottom) || 0;
    const calculatedMaxHeight = Math.ceil(lastVisibleSuggestion.offsetTop + lastVisibleSuggestion.offsetHeight + paddingBottom);

    setMenuMaxHeight(calculatedMaxHeight);
  }, [showMenu, suggestions]);

  React.useEffect(() => {
    if (!showMenu || !activeSuggestion || !menuRef.current) {
      return;
    }

    const activeElementId = `search-suggestion-${activeSuggestion.key}`;
    const activeItemElement = document.getElementById(activeElementId);

    if (!activeItemElement || !menuRef.current.contains(activeItemElement)) {
      return;
    }

    activeItemElement.scrollIntoView({ block: "nearest" });
  }, [activeSuggestion, showMenu]);

  const selectSuggestion = React.useCallback(
    (suggestion) => {
      dispatch(handleSuggestionSelected(suggestion));
      setActiveIndex(-1);
    },
    [dispatch]
  );

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
            setActiveIndex(-1);
          }}
          onFocus={() => dispatch(searchActions.setSuggestionsOpen(true))}
          onBlur={() => {
            window.setTimeout(() => dispatch(searchActions.setSuggestionsOpen(false)), 120);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();

              if (suggestions.length > 0) {
                setActiveIndex((currentActive) => (currentActive + 1 + suggestions.length) % suggestions.length);
              }

              return;
            }

            if (event.key === "ArrowUp") {
              event.preventDefault();

              if (suggestions.length > 0) {
                setActiveIndex((currentActive) => (currentActive - 1 + suggestions.length) % suggestions.length);
              }

              return;
            }

            if (event.key === "Escape") {
              dispatch(searchActions.setSuggestionsOpen(false));
              setActiveIndex(-1);
              return;
            }

            if (event.key === "Enter") {
              event.preventDefault();
            }
          }}
          onKeyUp={(event) => {
            if (event.key === "Enter" && activeSuggestion) {
              event.preventDefault();
              selectSuggestion(activeSuggestion.suggestion);
            }
          }}
          aria-activedescendant={activeSuggestion ? `search-suggestion-${activeSuggestion.key}` : undefined}
        />
        <InputGroup.Text id="searchicon">
          <FontAwesomeIcon icon={isSearching ? faSpinner : faMagnifyingGlass} spin={isSearching} />
        </InputGroup.Text>
      </InputGroup>

      {showMenu ? (
        <Dropdown.Menu
          ref={menuRef}
          show
          renderOnMount
          className="tt-dropdown-menu fishfry-search__menu"
          style={menuMaxHeight ? { maxHeight: `${menuMaxHeight}px` } : undefined}
        >
          {fishSuggestions.length > 0 ? <Dropdown.Header className="typeahead-header">Fish Frys</Dropdown.Header> : null}
          {fishSuggestions.map((suggestion, index) => (
            <Dropdown.Item
              as="button"
              type="button"
              key={`fish-${suggestion.id}`}
              id={`search-suggestion-fish-${suggestion.id}`}
              data-search-suggestion="true"
              className={`tt-suggestion ${activeIndex === index ? "tt-cursor" : ""}`}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => selectSuggestion(suggestion)}
            >
              {suggestion.name}
              <br />
              <small>{suggestion.address}</small>
            </Dropdown.Item>
          ))}

          {placeSuggestions.length > 0 ? <Dropdown.Header className="typeahead-header">Places</Dropdown.Header> : null}
          {placeSuggestions.map((suggestion, index) => {
            const suggestionIndex = fishSuggestions.length + index;

            return (
              <Dropdown.Item
                as="button"
                type="button"
                key={`map-${index}`}
                id={`search-suggestion-map-${index}`}
                data-search-suggestion="true"
                className={`tt-suggestion ${activeIndex === suggestionIndex ? "tt-cursor" : ""}`}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                onMouseEnter={() => setActiveIndex(suggestionIndex)}
                onClick={() => selectSuggestion(suggestion)}
              >
                {suggestion.name}
              </Dropdown.Item>
            );
          })}

          {!hasResults ? <Dropdown.ItemText className="tt-suggestion">No results</Dropdown.ItemText> : null}
        </Dropdown.Menu>
      ) : null}
    </div>
  );
};

export default SearchBox;
