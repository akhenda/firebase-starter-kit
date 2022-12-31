export const validateEmail = (email: string): boolean => {
  const re =
    // eslint-disable-next-line security/detect-unsafe-regex, no-useless-escape
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(String(email).toLowerCase());
};

export const validateNumber = (number: string): boolean => {
  const noSpaces = number.replace(/\s/g, '');
  const re = /[0-9-()]*[1-9][0-9-()]*/;
  return re.test(noSpaces);
};

export const isEmailOrNumber = (emailOrNumber: string): { email?: string; number?: string } => {
  if (validateEmail(emailOrNumber)) return { email: emailOrNumber };
  if (validateNumber(emailOrNumber)) return { number: emailOrNumber };

  return {};
};

export const escapeDotAddress = (value: string) => `\`${value.replace(/\./g, '\\.')}\``;
