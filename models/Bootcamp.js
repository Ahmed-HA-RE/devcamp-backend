import mongoose from 'mongoose';
import slugify from 'slugify';
import { geocoder } from '../utils/geocoder.js';

const bootcampSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required'],
      unique: true,
      minLength: 3,
      maxLength: 30,
    },
    slug: String,
    description: { type: String, required: true, maxLength: 500 },
    email: {
      type: String,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please add a valid email'],
    },
    phone: {
      type: String,
      maxLength: [20, 'Please enter a valid phone number'],
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
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: { type: String, default: 'N/A' },
      country: String,
    },
    careers: {
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
      min: [1, 'Rating must be at least 1'],
      max: [10, "Rating can't be more than 10"],
    },
    averageCost: Number,
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
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// create bootcamp slug from the name
bootcampSchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true });
});

// Create location field
bootcampSchema.pre('save', async function () {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: `${loc[0].formattedAddress.split(',')[0]}, ${
      loc[0].city
    }, ${loc[0].country}`,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].state,
    country: loc[0].country,
  };

  this.address = undefined;
});

// reverse populate with virtuals
bootcampSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false,
});

// Cascade delete courses when related bootcamp is deleted
bootcampSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function () {
    console.log(`Courses being removed from bootcamp: ${this._id}`.red);
    await this.model('Course').deleteMany({ bootcamp: this._id });
  }
);

export const Bootcamp = mongoose.model('Bootcamp', bootcampSchema);
