import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    title: {
      type: String,
      trim: true,
      required: [true, 'Please add a course title'],
    },
    description: { type: String, requierd: [true, 'Please add a description'] },
    weeks: { type: Number, requierd: [true, 'Please add number of weeks'] },
    tuition: { type: Number, requierd: [true, 'Please add a tuition cost'] },
    minimumSkill: {
      type: String,
      requierd: [true, 'Please add a minimum skill'],
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    scholarshipAvailable: { type: Boolean, default: false },
    bootcamp: {
      type: mongoose.Schema.ObjectId,
      ref: 'Bootcamp',
      required: [true, 'Please provided the Bootcamp for this course'],
    },
  },
  { timestamps: true }
);

// Static method to calculate avg cost of tuitions
courseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);

  await this.model('Bootcamp').findByIdAndUpdate(
    bootcampId,
    { averageCost: Math.ceil(obj[0].averageCost / 10) * 10 },
    { new: true, runValidators: true }
  );
};

// Call getAverageCost after save
courseSchema.post('save', function () {
  this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost after save
courseSchema.post('deleteOne', { document: true, query: false }, function () {
  this.constructor.getAverageCost(this.bootcamp);
});

export const Course = mongoose.model('Course', courseSchema);
