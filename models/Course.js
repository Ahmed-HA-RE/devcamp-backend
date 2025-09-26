import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Please add a course title'],
    },
    description: { type: String, requierd: [true, 'Please add a description'] },
    weeks: { type: String, requierd: [true, 'Please add number of weeks'] },
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

export const Course = mongoose.model('Course', courseSchema);
