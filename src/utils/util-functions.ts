// import moment from "moment";
// import validator from "validator";
// import { rule } from "../../core/model/Input";
// import { store } from "../store";

import {MutableRefObject, useEffect} from 'react';
import {GestureResponderEvent, TouchableHighlight} from 'react-native';
import Toast from 'react-native-toast-message';
import {store} from '../shared';

// export const isMobile = () => {
//   const width = store.getState().root.DEVICE_WIDTH;
//   return width <= 767;
// }

// export const errorMessage = (
//   value: string | number,
//   rules: rule[],
//   confirmPassword?: string
// ): string | null => {
//   let errorMsg: string | null = null;

//   rules.forEach((rule: rule) => {
//     switch (rule.name) {
//       case "email":
//         value.toString().length > 1 &&
//           !validator.isEmail(value.toString()) &&
//           (errorMsg = "L'EMAIL DOIT ÊTRE VALIDE");
//         break;
//       case "required":
//         !validator.isLength(value.toString(), { min: 2 }) &&
//           (errorMsg = "CE CHAMP EST OBLIGATOIRE");
//         break;
//       case "length":
//         !validator.isLength(value.toString(), { max: rule?.max as number }) &&
//           (errorMsg = "MAXIMUM " + rule?.max + " CHARACTERS");
//         break;
//       case "minLength":
//         !validator.isLength(value.toString(), { min: rule?.min as number }) &&
//           (errorMsg = "MINIMUM " + rule?.min + " CHARACTERS");
//         break;
//       case "phone":
//         !validator.isMobilePhone("0" + value.toString(), "fr-FR") &&
//           (errorMsg = "NUMERO DE TÉLÉPHONE INVALID");
//         break;
//       case "number":
//         !validator.isNumeric(value.toString()) &&
//           (errorMsg = "CHAMP INCORRECT");
//         break;
//       case "verification-code":
//         value.toString().length < 4 &&
//           (errorMsg = "VERIFICARTION CODE INCORRECT");
//         break;
//       case "confirmPassword":
//         value.toString() !== confirmPassword &&
//           (errorMsg = "MOT DE PASSE NON SIMILAIRE");
//         break;
//       case "min":
//         !validator.isLength(value.toString(), { min: 1 }) &&
//           (errorMsg = "CE CHAMP EST OBLIGATOIRE");
//         break;
//       default:
//         errorMsg = null;
//         break;
//     }
//   });
//   return errorMsg;
// };

// const frenshFormat = "DD/MM/YYYY";

// export const getDateFromUnix = (unix: number, format = frenshFormat) => {
//   return moment.unix(unix).format(format);
// }

// export const getDateFromPlusDays = (unix: number, days: number) => {
//   return moment.unix(unix).add(days, "days").format(frenshFormat);
// }

// export const tomorrowStringDate = () => {
//   const today = new Date()
//   const tomorrow = new Date(today)
//   tomorrow.setDate(tomorrow.getDate() + 1).toString();
//   return tomorrow.getDate() + '/' + (tomorrow.getMonth()+1).toString().padStart(2, "0") +'/' + tomorrow.getFullYear();
// }

// export const convertDate = (date: string) => {
//   return moment(date, frenshFormat).format('YYYY-MM-DD').toString()
// }

// export const isFrenshDate = (value: string) => {
//   const date = value.split('-');
//   return date.length === 3 && date[0].length === 4;
// }

// export const convertDateToValidFormat = (date: string) => {
//   let validDate = '';
//   if (isFrenshDate(date)) {
//     validDate = date.replace('-', '/');
//   } else {
//     const dateParts = date.split('/');
//     dateParts[0].length === 4 ? validDate = dateParts[0] + '/' + dateParts[1] + '/' + dateParts[2] : validDate = dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0]
//   }
//   return validDate;
// }

export const randomId = (len: number) => {
  let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXZ';
  let arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(str[Math.floor(Math.random() * str.length)]);
  }
  return arr.join('');
};

export const extractExtension = (str: string) => {
  const index = str.lastIndexOf('.');
  return index !== -1 ? str.slice(index + 1) : null;
};

export function useOutsideAlerter(
  ref: MutableRefObject<any>,
  setPressHandler?: (arg?: (e: GestureResponderEvent) => void) => void,
  setIsSelecting?: (arg: boolean) => void,
) {
  useEffect(() => {
    function handleClickOutside(event: GestureResponderEvent) {
      if (
        ref.current &&
        ref.current.props.children !== event.target &&
        setIsSelecting
      ) {
        setIsSelecting(false);
      }
    }
    if (setPressHandler) {
      setPressHandler(() => handleClickOutside);
    }

    return () => {
      if (setPressHandler) {
        setPressHandler();
      }
    };
  }, []);
}
