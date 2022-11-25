export const checkLength = (password: string) => {
  return password.length > 7;
};

export const checkUpperCase = (password: string) => {
  return /[A-Z]+/.test(password);
};

export const checkNumber = (password: string) => {
  return /[0-9]+/.test(password);
};

export const checkSpecialChar = (password: string) => {
  return /[*@!#%&()^~{}]+/.test(password);
};

export const checkAtLeastLength = (expression: string, length: number) => expression && expression.trim().length >= length;

export const checkIsfilled = (expression: string) => expression && expression.length > 0;

export const checkIsTrue = (expression: any) => expression;

export const checkUpper=(expression:string)=>{
    const upper=/[A-Z]+/.test(expression)

   return upper ? true : false
}
export const checkSpecialCharacter=(expression:string)=>{
    const character=/[^A-Za-z 0-9]+/.test(expression)
     return character ? true : false

}
export const checkDigit=(expression:string)=>{
    const digit=/[0-9]+/.test(expression)

   return digit ? true : false
}

export const checkEmailPattern = (mail: string) => {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(mail);
}

export const parseOnlyLetterAndSpace = (expression: string) => expression.replace(/[^A-Za-z ]/g, '');

export const parseLength = (expression: string, length: number) => expression.substring(0, length);
