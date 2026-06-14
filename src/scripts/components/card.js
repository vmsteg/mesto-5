const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

const updateLikeState = (likeButton, likes, userId) => {
  const isLiked = likes.some((user) => user._id === userId);
  likeButton.classList.toggle("card__like-button_is-active", isLiked);
};

export const createCardElement = (
  data,
  userId,
  { onPreviewPicture, onLikeIcon, onDeleteCard }
) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(
    ".card__control-button_type_delete"
  );
  const likeCountElement = cardElement.querySelector(".card__like-count");
  const cardImage = cardElement.querySelector(".card__image");

  cardElement.dataset.cardId = data._id;
  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardElement.querySelector(".card__title").textContent = data.name;
  likeCountElement.textContent = data.likes.length;
  updateLikeState(likeButton, data.likes, userId);

  if (data.owner._id !== userId) {
    deleteButton.remove();
  }

  if (onLikeIcon) {
    likeButton.addEventListener("click", () =>
      onLikeIcon(cardElement, data._id, likeButton)
    );
  }

  if (onDeleteCard && data.owner._id === userId) {
    deleteButton.addEventListener("click", () =>
      onDeleteCard(cardElement, data._id)
    );
  }

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () =>
      onPreviewPicture({ name: data.name, link: data.link })
    );
  }

  return cardElement;
};

export const updateCardLike = (cardElement, likes, userId) => {
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCountElement = cardElement.querySelector(".card__like-count");
  likeCountElement.textContent = likes.length;
  updateLikeState(likeButton, likes, userId);
};

export const deleteCard = (cardElement) => {
  cardElement.remove();
};
