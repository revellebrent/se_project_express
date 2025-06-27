const ClothingItem = require("../models/clothingItem");
const {
  INTERNAL_SERVER_ERROR_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  FORBIDDEN_STATUS_CODE,
} = require("../utils/errors");

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Clothing item not found" });
      }
      return res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({
        message: "Failed to like clothing item",
        error: err.message,
      });
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Clothing item not found" });
      }
      return res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid item ID format" });
      }
      return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({
        message: "Failed to unlike clothing item",
        error: err.message,
      });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  return ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Clothing item not found" });
      }
      if (item.owner.toString() !== userId) {
        return res
          .status(FORBIDDEN_STATUS_CODE)
          .send({ message: "You can only delete your own items" });
      }
      return ClothingItem.findByIdAndDelete(itemId).then(() =>
        res.status(200).send(item)
      );
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid item ID format" });
      }
      return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({
        message: "Failed to delete clothing item",
        error: err.message,
      });
    });
};

const getItems = (req, res) => ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({
        message: "Failed to retrieve clothing items",
        error: err.message,
      });
    });

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);

      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid clothing item data" });
      }
      return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({
        message: "Failed to create clothing item",
        error: err.message,
      });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
