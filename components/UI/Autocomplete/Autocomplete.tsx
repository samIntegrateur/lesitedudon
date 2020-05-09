import React, {useEffect, useState, useRef, useCallback} from 'react';
import classes from './Autocomplete.module.css';
import Spinner from '../Spinner/Spinner';
import {
  ComplexResultDisplay,
  ComplexValue,
  HTMLFormControlElement,
} from "../../../shared/types/form.type";
import useDebounce from "../../../hooks/useDebounce";

interface AutocompleteProps {
  inputRef: React.RefObject<HTMLFormControlElement>;
  searchValue: string;
  updateValueFunction: (value: ComplexValue) => void;
  apiCallFunction: (value: string) => Promise<[]>;
  resultKey: string;
  resultDisplay: string | ComplexResultDisplay;
}
const Autocomplete: React.FC<AutocompleteProps> = (props) => {

  const {
    inputRef, // the input ref which need autocomplete

    // nb: I wanted to use a change listener for ref (as for keydown), but it seems to be complicated
    // https://stackoverflow.com/questions/55838351/how-do-we-know-when-a-react-ref-current-value-has-changed
    searchValue, // value from the input

    updateValueFunction, // Call a function to update state without retriggering autocomplete

    apiCallFunction, // a promise function that make the api call and take a search string as a parameter
    resultKey, // the response param to be used as key
    resultDisplay, // the response param to be displayed
    // either a string for one value,
    // or an object if compounded { values: ['string',...], separator: 'string'}
  } = props;

  // ------------------ State ------------------
  const suggestionsRef = useRef<HTMLUListElement>(null);

  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [results, setResults] = useState<[]>([]);
  const [skipNextChange, setSkipNextChange] = useState<boolean>(false);

  const [isSearching, setIsSearching] = useState<boolean>(false);

  const debouncedSearchTerm = useDebounce(searchTerm ? searchTerm : '', 500);

  const onInputKeyDownHandler = useCallback((e) => {
    // if we press down, and we have suggestions, move focus
    if (e.key === 'ArrowDown' && results.length && !isSearching && suggestionsRef && suggestionsRef.current) {
      e.preventDefault();
      const firstResult: HTMLLIElement | null = suggestionsRef.current.firstElementChild as HTMLLIElement;

      if (firstResult) {
        firstResult.focus();
      }
    }
  }, [results, isSearching, suggestionsRef]);

  const inputCurrent = inputRef.current || null;

  // ------------------ Effects ------------------
  useEffect(() => {
    if (inputCurrent) {
      inputCurrent.addEventListener('keydown', onInputKeyDownHandler);
    }
    return (): void => {
      if (inputCurrent) {
        inputCurrent.removeEventListener('keydown', onInputKeyDownHandler);
      }
    }
  }, [inputCurrent, onInputKeyDownHandler]);

  useEffect(() => {
    setResults([]);

    if (skipNextChange) {
      setSkipNextChange(false);
    } else {
      setSearchTerm(searchValue);
    }
  }, [searchValue, setSkipNextChange]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      apiCallFunction(debouncedSearchTerm).then(response => {
        setIsSearching(false);
        setResults(response);
      });
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm, apiCallFunction]);

  const selectSuggestion = (element: HTMLLIElement, fullValue: any): void => {

    if (inputCurrent) {
      inputCurrent.value = element.textContent || '';

      // Avoid trigger autocomplete on this change
      setSkipNextChange(true);

      updateValueFunction({
        displayValue: element.textContent || '',
        completeValue: fullValue,
      });

      inputCurrent.focus();
      setResults([]);
    }
  };

  const onKeyDownHandler = (e: React.KeyboardEvent<HTMLLIElement>, fullValue: any): void => {
    const element = e.target as HTMLLIElement;

    // enter
    if (e.key === 'Enter') {
      selectSuggestion(element, fullValue);
    }
    // up
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevElement = element.previousElementSibling as HTMLLIElement;
      if (prevElement) {
        prevElement.focus();
      } else if (inputCurrent) {
        inputCurrent.focus();
      }
    }
    // down
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextElement = element.nextElementSibling as HTMLLIElement;
      if (nextElement) {
        nextElement.focus();
      }
    }
  };

  const handleItemDisplay = (item: any): string => {
    if (typeof resultDisplay === 'string') {
      return item[resultDisplay];
    } else {
      return (
        resultDisplay.values.reduce((acc, currentValue, index): string => {
          if (!item[currentValue]) {
            console.error(`Could not handle resultDisplayValue, ${currentValue} is not a valid param for api response`);
            return '';
          }
          if (index === 0) {
            return `${acc}${item[currentValue]}`;
          } else {
            return `${acc}${resultDisplay.separator}${item[currentValue]}`;
          }

        }, '')
      );
    }
  };

  // ------------------ Template ------------------

  let display;

  if (isSearching) {
    display = (
      <div className={classes.autocomplete__frame}>
        <Spinner small />
      </div>
    )
  } else if (results.length) {
    display = (
      <div className={classes.autocomplete__frame}>
        <ul className={classes.autocomplete__list}
            role="listbox"
            ref={suggestionsRef}
        >
          {results.map(result => (
              <li className={classes.autocomplete__listItem}
                  tabIndex={0}
                  role="option"
                  key={result[resultKey]}
                  onClick={(e): void => {
                    selectSuggestion(e.target as HTMLLIElement, result)
                  }}
                  onKeyDown={(e): void => {
                    onKeyDownHandler(e, result)
                  }}
              >
                {handleItemDisplay(result)}
              </li>
            ))}
        </ul>
      </div>
    );
  }


  return (
    <>
      <div className={classes.autocomplete}>
        {display}
      </div>
    </>
  );
};

export default Autocomplete;
