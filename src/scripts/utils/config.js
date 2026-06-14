// Укажите данные вашей когорты и токен из личного кабинета Практикума
export const apiConfig = {
  baseUrl: "https://nomoreparties.co/v1/cohort-51",
  headers: {
    authorization: "228cae98-cff9-4022-bb25-2678b613ba24",
    "Content-Type": "application/json",
  },
};

export const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorVisibleClass: "popup__error_visible",
};
