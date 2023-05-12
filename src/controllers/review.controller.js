import mongoose from "mongoose";
import Review from "../models/review.model.js";
import Appartment from "../models/appartment.model.js";

export async function createReview(req, res) {
  try {
    const review = new Review({
      User: req.user.id,
      UserName: req.body.UserName,
      Rating: req.body.Rating,
      Description: req.body.Description,
    });
    const savedReview = await review.save();
    const apartment = await Appartment.findById(req.params.param);
    // Update total rating and number of reviews for the apartment
    const newSumOfRatings = apartment.sumOfRatings + req.body.Rating;
    const numberOfRatings = apartment.numOfRatings + 1;
    await Appartment.findByIdAndUpdate(req.params.param, {
      $push: { reviews: savedReview._id },
      sumOfRatings: newSumOfRatings,
      numOfRatings: numberOfRatings,
      rating: Math.round((newSumOfRatings / numberOfRatings) * 2) / 2,
    })
      .then((result) => {
        res.status(201).json(savedReview);
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteReview(req, res) {
  try {
    const reviewRate = await Review.findById(req.params.param);
    const review = await Review.findByIdAndDelete(req.params.param);
    const apartment = await Appartment.findById(req.body.appartmentId);
    const newSumOfRatings = apartment.sumOfRatings - reviewRate.Rating;
    const numberOfRatings = parseInt(apartment.numOfRatings) - 1;
    const newRating =
      newSumOfRatings === 0 || numberOfRatings === 0
        ? 0
        : Math.round((newSumOfRatings / numberOfRatings) * 2) / 2;
    await Appartment.findByIdAndUpdate(req.body.appartmentId, {
      $pull: { reviews: review._id },
      sumOfRatings: newSumOfRatings,
      numOfRatings: numberOfRatings,
      rating: newRating,
    })
      .then((result) => {
        res.status(200).json({ message: "deleted successfully ! " });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateReview(req, res) {
  try {
    const review = await Review.findById(req.params.param);
    const oldRating = review.Rating;
    const newRating = parseFloat(req.body.rating);
    const apartmentId = req.body.appartmentId;
    const apartment = await Appartment.findById(apartmentId);
    const oldSumOfRatings = parseFloat(apartment.sumOfRatings);
    const oldNumOfRatings = parseFloat(apartment.numOfRatings);
    const newSumOfRatings = oldSumOfRatings - oldRating + newRating;
    const newNumOfRatings = oldNumOfRatings;
    const newRatingValue =
      newNumOfRatings === 0
        ? 0
        : Math.round((newSumOfRatings / newNumOfRatings) * 2) / 2;
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.param,
      { Rating: req.body.rating, Description: req.body.description },
      { new: true }
    )
      .then((result) => {
        res
          .status(201)
          .json({ message: "review updated successfuly !", object: result });
      })
      .catch((err) => res.status(500).json({ error: err.message }));
    const updatedApartment = await Appartment.findByIdAndUpdate(apartmentId, {
      sumOfRatings: newSumOfRatings,
      numOfRatings: newNumOfRatings,
      rating: newRatingValue,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getAllReviews(req, res) {
  try {
    const appartment = await Appartment.findById(req.params.param)
      .populate("reviews")
      .then((apart) => {
        res.status(200).json(apart.reviews);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get reviews.");
  }
}

export async function getReviewById(req, res) {
  try {
    const review = await Review.findById(req.params.param);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    return res.status(200).json(review);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
