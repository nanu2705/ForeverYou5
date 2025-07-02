import mongoose from 'mongoose';

const sliderImageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
});

 const SliderImage = mongoose.model('SliderImage', sliderImageSchema);

 export default SliderImage;
