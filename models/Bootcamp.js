import mongoose from 'mongoose';

const bootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required'],
      unique: true,
      minLength: 3,
      maxLength: 20,
    },
    slug: String,
    description: { type: String, required: true, maxLength: 500 },
    email: {
      type: String,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please add a valid email'],
    },
    phone: {
      type: String,
      maxLength: [14, 'Please enter a valid phone number'],
    },
    website: {
      type: String,
      match: [
        /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi,
        'Please use a valid URL with HTTP or HTTPS',
      ],
    },
    address: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        index: '2dsphere',
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: { type: String, default: 'UAE' },
    },
    carrers: {
      type: [String],
      enum: [
        'Web Development',
        'Mobile Development',
        'UI/UX',
        'Data Science',
        'Business',
        'Other',
      ],
    },
    averageRating: {
      type: Number,
      min: [1, 'Rating musst be at least 1'],
      max: [10, "Rating can't be more than 10"],
    },
    averageCost: String,
    photo: {
      type: String,
      default: 'no-photo.jpg',
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default Bootcamp = mongoose.model('Bootcamp', bootcampSchema);
