import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Please add a title for the review'],
      maxLength: 100,
    },
    text: { type: String, requierd: [true, 'Please add some text'] },
    rating: {
      type: Number,
      requierd: [true, 'Please add a rating from 1 till 10'],
      min: 1,
      max: 10,
    },
    bootcamp: {
      type: mongoose.Schema.ObjectId,
      ref: 'Bootcamp',
      required: [true, 'Please provided the Bootcamp for this course'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Please provided the user associated for this review'],
    },
  },
  { timestamps: true }
);

// Only one review for bootcamp per user
reviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// Calculate the average reviews per bootcamp
reviewSchema.statics.getAvgRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  await this.model('Bootcamp').findByIdAndUpdate(
    obj[0]._id,
    { averageRating: Math.round(obj[0].averageRating * 10) / 10 },
    { runValidators: false }
  );
};

// Calculate average rating to the bootcamp associated with after creating
reviewSchema.post('save', async function () {
  await this.constructor.getAvgRating(this.bootcamp);
});

// Calculate average rating to the bootcamp associated with after deleting
reviewSchema.post(
  'deleteOne',
  { document: true, query: false },
  async function () {
    await this.constructor.getAvgRating(this.bootcamp);
  }
);

export const Review = mongoose.model('Review', reviewSchema);
