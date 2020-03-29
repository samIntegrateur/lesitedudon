export const checkValidity = (value, rules, file = null) => {
  const errors = [];

  if (!rules) {
    return errors;
  }

  if (rules.required && value.trim() === '') {
    errors.push('Ce champ est obligatoire.');
  }

  if (rules.minLength && value.length < rules.minLength) {
    errors.push('Ce champ doit contenir au moins ' + rules.minLength + ' caractères.');
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    errors.push('Ce champ doit contenir au maximum ' + rules.minLength + ' caractères.');
  }

  if (rules.isEmail) {
    const pattern =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!pattern.test(value)) {
      errors.push('Ce champ doit contenir une adresse e-mail valide.');
    }
  }

  if (file) {

    if (rules.fileExtension && !rules.fileExtension.includes(file.type)) {
      errors.push('Ce type de ficher n\'est pas autorisé.');
    }

    if (rules.fileMaxSize) {
      const sizeInMo = (file.size/1048576);
      if (sizeInMo > rules.fileMaxSize) {
        errors.push('Le fichier est trop lourd, le poids maximum autorisé est de ' + rules.fileMaxSize + ' Mo.');
      }
    }

  }

  return errors;
};

// todo inputChangedHandler
