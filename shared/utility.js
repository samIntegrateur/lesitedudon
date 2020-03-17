export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties,
  };
};

export const updateApiState = (apiState, apiAction, updatedProperties) => {
  return updateObject(apiState, {
    [apiAction]: updateObject(apiState[apiAction], updatedProperties)
  });
};

export const checkValidity = (value, rules) => {
  if (!rules) {
    return true;
  }

  let isValid = true;

  if (rules.required) {
    isValid = value.trim() !== '' && isValid;
  }

  if (rules.minLength && isValid) {
    isValid = value.length >= rules.minLength;
  }

  if (rules.maxLength && isValid) {
    isValid = value.length <= rules.minLength;
  }

  if (rules.isEmail && isValid) {
    const pattern =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    isValid = pattern.test(value);
  }

  return isValid;
};

export const sanitizeOffers = (data) => {
  let sanitizedOffersData = [];
  for (let key in data) {
    sanitizedOffersData.push({
      ...data[key],
      id: key,
    });
  }
  sanitizedOffersData.sort((a, b) => (a.creationDate < b.creationDate) ? 1 : -1);
  return sanitizedOffersData;
};
