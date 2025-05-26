export const validateInputs = (value: string, type: string) => {
  if (!value) {
    return false;
  } else {
    if (type === 'email' && !/\S+@\S+\.\S+/.test(value)) {
      return false;
    }

    if (type === 'password' && value.length < 6) {
      return false;
    }

    if (type === 'number' && !/^\d+$/.test(value)) {
      return false;
    }

    if (
      type === 'tel' &&
      value?.trim() !== '' &&
      !/^07[2389][0-9]{7}$/.test(value)
    ) {
      return false;
    }

    if (type === 'text' && !/^\s*[\s\S]+?\s*$/.test(value)) {
      return false;
    }
    if (type === 'url' && !/(ftp|http|https|www):\/\/[^ "]+$/.test(value)) {
      return false;
    }
    if (type === 'textarea' && !/^\s*[\s\S]+?\s*$/.test(value)) {
      return false;
    }
    if (type === 'nid' && value?.length !== 16) {
      return false;
    }
    if (type === 'tin' && value?.length !== 9) {
      return false;
    }
    if (type === 'nid' && value?.length !== 16) {
      return false;
    }
    if (
      type === 'password' &&
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(value)
    ) {
      return false;
    }
    if (type === 'passport' && !/^[a-zA-Z0-9]{12}$/g.test(value)) {
      return false;
    }
    if (type === 'plate_number' && !/^R[A-Z]{2}\d{3}[A-Z]$/g.test(value)) {
      return false;
    }
  }

  return true;
};

export const validatePassword = (password: string) => {
  const missingCharacters = [
    {
      message: 'Uppercase letter',
      type: 'uppercase',
      color: 'red',
    },
    {
      message: 'Lowercase letter',
      type: 'lowercase',
      color: 'red',
    },
    {
      message: 'Numeral character',
      type: 'number',
      color: 'red',
    },
    {
      message: 'Special characters',
      type: 'special',
      color: 'red',
    },
  ];

  if (password && /(?=.*[A-Z])/.test(password)) {
    const uppercaseCharacter = missingCharacters.find(
      (character) => character.type === 'uppercase'
    );
    if (uppercaseCharacter) {
      uppercaseCharacter.color = 'green';
    }
  }
  if (password && /(?=.*[a-z])/.test(password)) {
    const lowercaseCharacter = missingCharacters.find(
      (character) => character.type === 'lowercase'
    );
    if (lowercaseCharacter) {
      lowercaseCharacter.color = 'green';
    }
  }
  if (password && /(?=.*\d)/.test(password)) {
    const numeralCharacter = missingCharacters.find(
      (character) => character.type === 'number'
    );
    if (numeralCharacter) {
      numeralCharacter.color = 'green';
    }
  }
  if (password && /(?=.*[^\w\s])/.test(password)) {
    const specialCharacter = missingCharacters.find(
      (character) => character.type === 'special'
    );
    if (specialCharacter) {
      specialCharacter.color = 'green';
    }
  }

  return missingCharacters;
};
