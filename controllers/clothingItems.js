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
          .json({ message: "Clothing item not found" });
      }
      return res.json(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .json({ message: "Invalid item ID format" });
      }
      return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).json({
        message: "Failed to like clothing item",
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
          .json({ message: "Clothing item not found" });
      }
      return res.json(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .json({ message: "Invalid item ID format" });
      }
      return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).json({
        message: "Failed to unlike clothing item",
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
          .json({ message: "Clothing item not found" });
      }
      if (item.owner.toString() !== userId) {
        return res
          .status(FORBIDDEN_STATUS_CODE)
          .json({ message: "You can only delete your own items" });
      }
      return ClothingItem.findByIdAndDelete(itemId).then(() =>
        res.json(item)
      );
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .json({ message: "Invalid item ID format" });
      }
      return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).json({
        message: "Failed to delete clothing item",
      });
    });
};

const getItems = (req, res) =>
  ClothingItem.find({})
    .then((items) => res.json(items))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).json({
        message: "Failed to retrieve clothing items",
      });
    });

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  if (!name || !weather || !imageUrl) {
    return res
      .status(BAD_REQUEST_STATUS_CODE).json({
        message: "Name, weather, and imageUrl are required fields",
      });
  }
  const owner = req.user._id;

  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      return res.status(201).json(item);
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "ValidationError") {
        const errors = Object.keys(err.errors).map((key) => {
          return { field: key, message: err.errors[key].message };
        });
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .json({
            message: "Invalid clothing item data",
            errors: errors,
          });
      }
      return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).json({
        message: "Failed to create clothing item",
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
