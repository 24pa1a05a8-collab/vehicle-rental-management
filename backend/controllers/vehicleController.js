import Vehicle from '../models/Vehicle.js';
import Booking from '../models/Booking.js';
import Category from '../models/Category.js';

// @desc    Get all vehicles with comprehensive search, filter, sort & pagination
// @route   GET /api/vehicles
// @access  Public
export const getVehicles = async (req, res, next) => {
  try {
    const {
      search,
      category,
      vehicleType,
      fuelType,
      transmissionType,
      seatingCapacity,
      minPrice,
      maxPrice,
      availabilityStatus,
      sortBy,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Availability filter (default show all or only available)
    if (availabilityStatus !== undefined) {
      query.availabilityStatus = availabilityStatus === 'true';
    }

    // Keyword Search across name, brand, model, description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { vehicleType: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by Category ObjectId or name
    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const catDoc = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, 'i') } });
        if (catDoc) {
          query.category = catDoc._id;
        }
      }
    }

    // Filter by Vehicle Type
    if (vehicleType) {
      query.vehicleType = { $regex: new RegExp(`^${vehicleType}$`, 'i') };
    }

    // Filter by Fuel Type
    if (fuelType) {
      query.fuelType = fuelType;
    }

    // Filter by Transmission
    if (transmissionType) {
      query.transmissionType = transmissionType;
    }

    // Filter by Seating Capacity
    if (seatingCapacity) {
      query.seatingCapacity = { $gte: Number(seatingCapacity) };
    }

    // Filter by Price Range
    if (minPrice || maxPrice) {
      query.rentalPricePerDay = {};
      if (minPrice) query.rentalPricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.rentalPricePerDay.$lte = Number(maxPrice);
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sortBy === 'price_asc') sortOptions = { rentalPricePerDay: 1 };
    if (sortBy === 'price_desc') sortOptions = { rentalPricePerDay: -1 };
    if (sortBy === 'name_asc') sortOptions = { name: 1 };
    if (sortBy === 'rating_desc') sortOptions = { rating: -1 };

    // Pagination
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 12;
    const skip = (pageNum - 1) * limitNum;

    const totalVehicles = await Vehicle.countDocuments(query);
    const vehicles = await Vehicle.find(query)
      .populate('category', 'name slug icon')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: vehicles.length,
      totalVehicles,
      totalPages: Math.ceil(totalVehicles / limitNum),
      currentPage: pageNum,
      vehicles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Public
export const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('category', 'name slug icon');

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    }

    res.status(200).json({
      success: true,
      vehicle,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check vehicle availability for specific date range
// @route   GET /api/vehicles/:id/check-availability
// @access  Public
export const checkVehicleAvailability = async (req, res, next) => {
  try {
    const { pickupDate, returnDate } = req.query;

    if (!pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both pickupDate and returnDate.',
      });
    }

    const start = new Date(pickupDate);
    const end = new Date(returnDate);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'Return date must be strictly after pickup date.',
      });
    }

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    }

    if (!vehicle.availabilityStatus) {
      return res.status(200).json({
        success: true,
        isAvailable: false,
        message: 'Vehicle is currently marked as unavailable for maintenance or service.',
      });
    }

    // Check for overlapping confirmed or active bookings
    const overlappingBookings = await Booking.find({
      vehicle: req.params.id,
      status: { $in: ['Pending', 'Confirmed', 'Active'] },
      $or: [
        { pickupDate: { $lt: end }, returnDate: { $gt: start } },
      ],
    });

    const isAvailable = overlappingBookings.length === 0;

    res.status(200).json({
      success: true,
      isAvailable,
      message: isAvailable
        ? 'Vehicle is available for the selected dates.'
        : 'Vehicle is already booked or reserved for these dates. Please choose another date or vehicle.',
      overlappingCount: overlappingBookings.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new vehicle
// @route   POST /api/vehicles
// @access  Private/Admin
export const createVehicle = async (req, res, next) => {
  try {
    const {
      name,
      brand,
      model,
      registrationNumber,
      category,
      vehicleType,
      fuelType,
      transmissionType,
      seatingCapacity,
      rentalPricePerDay,
      description,
      images,
      availabilityStatus,
      features,
      mileage,
      location,
    } = req.body;

    const existingReg = await Vehicle.findOne({
      registrationNumber: registrationNumber.toUpperCase().trim(),
    });

    if (existingReg) {
      return res.status(400).json({
        success: false,
        message: 'A vehicle with this registration number already exists.',
      });
    }

    const vehicle = await Vehicle.create({
      name,
      brand,
      model,
      registrationNumber: registrationNumber.toUpperCase().trim(),
      category,
      vehicleType,
      fuelType,
      transmissionType,
      seatingCapacity,
      rentalPricePerDay,
      description,
      images: Array.isArray(images) && images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      ],
      availabilityStatus: availabilityStatus !== undefined ? availabilityStatus : true,
      features: features || undefined,
      mileage: mileage || 'Unlimited',
      location: location || 'Central Hub - City Center',
    });

    const populatedVehicle = await Vehicle.findById(vehicle._id).populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Vehicle added successfully.',
      vehicle: populatedVehicle,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private/Admin
export const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    }

    if (req.body.registrationNumber) {
      const regUpper = req.body.registrationNumber.toUpperCase().trim();
      const existing = await Vehicle.findOne({
        registrationNumber: regUpper,
        _id: { $ne: req.params.id },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Another vehicle already uses this registration number.',
        });
      }
      req.body.registrationNumber = regUpper;
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully.',
      vehicle: updatedVehicle,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private/Admin
export const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    }

    // Check if vehicle has active or pending bookings
    const activeBookings = await Booking.countDocuments({
      vehicle: req.params.id,
      status: { $in: ['Pending', 'Confirmed', 'Active'] },
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete vehicle: It has ${activeBookings} active/pending booking(s). Please resolve those bookings first.`,
      });
    }

    await vehicle.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle vehicle availability status
// @route   PATCH /api/vehicles/:id/toggle-availability
// @access  Private/Admin
export const toggleVehicleAvailability = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    }

    vehicle.availabilityStatus = !vehicle.availabilityStatus;
    await vehicle.save();

    res.status(200).json({
      success: true,
      message: `Vehicle availability set to: ${vehicle.availabilityStatus ? 'Available' : 'Unavailable'}.`,
      availabilityStatus: vehicle.availabilityStatus,
    });
  } catch (error) {
    next(error);
  }
};
