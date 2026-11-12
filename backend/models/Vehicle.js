import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide vehicle name'],
      trim: true,
      maxlength: [80, 'Vehicle name cannot exceed 80 characters'],
    },
    brand: {
      type: String,
      required: [true, 'Please provide vehicle brand (e.g. BMW, Tesla, Toyota)'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Please provide vehicle model (e.g. 2024, Model 3, X5)'],
      trim: true,
    },
    registrationNumber: {
      type: String,
      required: [true, 'Please provide vehicle registration / plate number'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please select a vehicle category'],
    },
    vehicleType: {
      type: String,
      required: [true, 'Please provide vehicle type (e.g. SUV, Sedan, Luxury, Electric)'],
      trim: true,
    },
    fuelType: {
      type: String,
      required: [true, 'Please select fuel type'],
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
      default: 'Petrol',
    },
    transmissionType: {
      type: String,
      required: [true, 'Please select transmission type'],
      enum: ['Automatic', 'Manual'],
      default: 'Automatic',
    },
    seatingCapacity: {
      type: Number,
      required: [true, 'Please specify seating capacity'],
      min: [1, 'Seats must be at least 1'],
      max: [50, 'Seats cannot exceed 50'],
      default: 5,
    },
    rentalPricePerDay: {
      type: Number,
      required: [true, 'Please specify rental price per day'],
      min: [1, 'Rental price must be greater than 0'],
    },
    description: {
      type: String,
      required: [true, 'Please provide vehicle description'],
      trim: true,
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one vehicle image URL'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A vehicle must have at least one image',
      },
    },
    availabilityStatus: {
      type: Boolean,
      default: true,
    },
    features: {
      type: [String],
      default: ['GPS Navigation', 'Bluetooth', 'Air Conditioning', 'Backup Camera', 'Apple CarPlay / Android Auto'],
    },
    mileage: {
      type: String,
      default: 'Unlimited',
    },
    rating: {
      type: Number,
      default: 4.8,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    location: {
      type: String,
      default: 'Central Hub - City Center',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast search & filtering
vehicleSchema.index({ name: 'text', brand: 'text', model: 'text', vehicleType: 'text' });
vehicleSchema.index({ rentalPricePerDay: 1 });
vehicleSchema.index({ availabilityStatus: 1 });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
