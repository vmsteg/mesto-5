/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/

import { Api } from "./components/api.js";
import {
  createCardElement,
  deleteCard,
  updateCardLike,
} from "./components/card.js";
import {
  openModalWindow,
  closeModalWindow,
  setCloseModalWindowEventListeners,
} from "./components/modal.js";
import { FormValidator } from "./components/validation.js";
import { apiConfig, validationConfig } from "./utils/config.js";

const api = new Api(apiConfig);

// DOM узлы
const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(
  ".popup__input_type_description"
);
const profileSubmitButton = profileForm.querySelector(".popup__button");

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");
const cardSubmitButton = cardForm.querySelector(".popup__button");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");
const avatarSubmitButton = avatarForm.querySelector(".popup__button");

const deleteCardModalWindow = document.querySelector(".popup_type_remove-card");
const deleteCardForm = deleteCardModalWindow.querySelector(".popup__form");
const deleteCardSubmitButton = deleteCardForm.querySelector(".popup__button");

let userId;
let cardToDelete = null;
let cardIdToDelete = null;

const profileFormValidator = new FormValidator(validationConfig, profileForm);
const cardFormValidator = new FormValidator(validationConfig, cardForm);
const avatarFormValidator = new FormValidator(validationConfig, avatarForm);

profileFormValidator.enableValidation();
cardFormValidator.enableValidation();
avatarFormValidator.enableValidation();

const renderCards = (cards) => {
  cards.forEach((cardData) => {
    placesWrap.append(
      createCardElement(cardData, userId, {
        onPreviewPicture: handlePreviewPicture,
        onLikeIcon: handleLikeIcon,
        onDeleteCard: handleDeleteCard,
      })
    );
  });
};

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const handleLikeIcon = (cardElement, cardId, likeButton) => {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");

  api
    .changeLikeCardStatus(cardId, isLiked)
    .then((updatedCard) => {
      updateCardLike(cardElement, updatedCard.likes, userId);
    })
    .catch((err) => console.log(err));
};

const handleDeleteCard = (cardElement, cardId) => {
  cardToDelete = cardElement;
  cardIdToDelete = cardId;
  openModalWindow(deleteCardModalWindow);
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  profileSubmitButton.textContent = "Сохранение...";

  api
    .editProfile({
      name: profileTitleInput.value,
      about: profileDescriptionInput.value,
    })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModalWindow(profileFormModalWindow);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      profileSubmitButton.textContent = "Сохранить";
    });
};

const handleAvatarFormSubmit = (evt) => {
  evt.preventDefault();
  avatarSubmitButton.textContent = "Сохранение...";

  api
    .changeAvatar(avatarInput.value)
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModalWindow(avatarFormModalWindow);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      avatarSubmitButton.textContent = "Сохранить";
    });
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  cardSubmitButton.textContent = "Сохранение...";

  api
    .addCard({
      name: cardNameInput.value,
      link: cardLinkInput.value,
    })
    .then((newCard) => {
      placesWrap.prepend(
        createCardElement(newCard, userId, {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: handleLikeIcon,
          onDeleteCard: handleDeleteCard,
        })
      );
      closeModalWindow(cardFormModalWindow);
      cardForm.reset();
      cardFormValidator.resetValidation();
    })
    .catch((err) => console.log(err))
    .finally(() => {
      cardSubmitButton.textContent = "Создать";
    });
};

const handleDeleteCardFormSubmit = (evt) => {
  evt.preventDefault();
  deleteCardSubmitButton.textContent = "Удаление...";

  api
    .deleteCard(cardIdToDelete)
    .then(() => {
      deleteCard(cardToDelete);
      closeModalWindow(deleteCardModalWindow);
      cardToDelete = null;
      cardIdToDelete = null;
    })
    .catch((err) => console.log(err))
    .finally(() => {
      deleteCardSubmitButton.textContent = "Да";
    });
};

profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFormSubmit);
deleteCardForm.addEventListener("submit", handleDeleteCardFormSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  profileFormValidator.resetValidation();
  openModalWindow(profileFormModalWindow);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  avatarFormValidator.resetValidation();
  openModalWindow(avatarFormModalWindow);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  cardFormValidator.resetValidation();
  openModalWindow(cardFormModalWindow);
});

Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, cards]) => {
    userId = userData._id;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
    renderCards(cards);
  })
  .catch((err) => console.log(err));

const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});
