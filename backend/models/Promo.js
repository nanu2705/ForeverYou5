import mongoose from 'mongoose';

const promoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    ctaText: {
      type: String,
      required: true,
    },
    ctaLink: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

const PromoBanner = mongoose.model('PromoBanner', promoSchema);

export default PromoBanner;
