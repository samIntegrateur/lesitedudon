import React, {useEffect, useState, useRef, useCallback} from 'react';
import classes from './Autocomplete.module.css';
import useDebounce from '../../../hooks/useDebounce';
import Spinner from '../Spinner/Spinner';

const Autocomplete = (props) => {

  const {
    inputRef, // the input ref which need autocomplete

    // nb: I wanted to use a change listener for ref (as for keydown), but it seems to be complicated
    // https://stackoverflow.com/questions/55838351/how-do-we-know-when-a-react-ref-current-value-has-changed
    searchValue, // value from the input

    updateValue, // Call a function to update state without retriggering autocomplete

    apiCallFunction, // a promise function that make the api call and take a search string as a parameter
    resultKey, // the response param to be used as key
    resultDisplay, // the response param to be displayed
    // either a string for one value,
    // or an object if compounded { values: ['string',...], separator: 'string'}
  } = props;

  const suggestionsRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState(null);
  const [results, setResults] = useState([]);
  const [skipNextChange, setSkipNextChange] = useState(false);

  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  let display;

  const onInputKeyDownHandler = useCallback((e) => {
    console.log('onInputKeyDownHandler', e);
    // console.log('results', results);
    // if we press down, and we have suggestions, move focus
    if (e.key === 'ArrowDown' && results.length && !isSearching && suggestionsRef && suggestionsRef.current) {
      e.preventDefault();
      console.log('focus');
      suggestionsRef.current.firstChild.focus();
    }
  }, [results, isSearching, suggestionsRef]);

  const inputCurrent = inputRef.current || null;

  useEffect(() => {
    if (inputCurrent) {
      inputCurrent.addEventListener('keydown', onInputKeyDownHandler);
    }
    return () => {
      if (inputCurrent) {
        inputCurrent.removeEventListener('keydown', onInputKeyDownHandler);
      }
    }
  }, [inputCurrent, onInputKeyDownHandler]);

  useEffect(() => {
    console.log('-----------------searchvalue-----------------', searchValue);
    setResults([]);

    if (skipNextChange) {
      setSkipNextChange(false);
    } else {
      setSearchTerm(searchValue);
    }
  }, [searchValue]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      apiCallFunction(debouncedSearchTerm).then(response => {
        console.log('response', response);
        setIsSearching(false);
        setResults(response);
      });
    } else {
      console.log('set empty result');
      setResults([]);
    }
  }, [debouncedSearchTerm, apiCallFunction]);

  const selectSuggestion = (element, fullValue) => {
    console.log('you have selected', fullValue);
    inputCurrent.value = element.textContent;

    // Avoid trigger autocomplete on this change
    setSkipNextChange(true);

    updateValue({
      displayValue: element.textContent,
      completeValue: fullValue,
    });
    inputCurrent.focus();
    setResults([]);
  };

  const onKeyDownHandler = (e, fullValue) => {
    // enter
    if (e.key === 'Enter') {
      console.log('enter, todo select current option');
      selectSuggestion(e.target, fullValue);
    }
    // up
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      console.log('go up');
      if (e.target.previousElementSibling) {
        e.target.previousElementSibling.focus();
      } else if (inputCurrent) {
        inputCurrent.focus();
      }
    }
    // down
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      console.log('go down');
      if (e.target.nextElementSibling) {
        e.target.nextElementSibling.focus();
      }
    }
  };

  const handleItemDisplay = (item) => {
    if (typeof resultDisplay === 'string') {
      return item[resultDisplay];
    } else {
      return (
        resultDisplay.values.reduce((acc, currentValue, index) => {
          if (!item[currentValue]) {
            console.error(`Could not handle resultDisplayValue, ${currentValue} is not a valid param for api response`);
            return;
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
                  tabIndex="0"
                  role="option"
                  key={result[resultKey]}
                  onClick={(e) => selectSuggestion(e.target, result)}
                  onKeyDown={(e) => onKeyDownHandler(e, result)}
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
