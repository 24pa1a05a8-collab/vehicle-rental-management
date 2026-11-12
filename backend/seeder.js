import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Category from './models/Category.js';
import Vehicle from './models/Vehicle.js';
import Booking from './models/Booking.js';
import Payment from './models/Payment.js';
import { categoriesData, vehiclesData } from './utils/seedData.js';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vehicle_rental_db'
    );
    console.log(`[Seeder] MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`[Seeder Error]: ${err.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing database collections...');
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Vehicle.deleteMany(),
      Booking.deleteMany(),
      Payment.deleteMany(),
    ]);

    console.log('Seeding Users...');
    // Note: User.pre('save') will hash the passwords automatically
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@vrms.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 98765 43210',
      address: 'Suite 101, VRMS Corporate Tower, Cyber City',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    });

    const customerUser1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
      phone: '+91 98123 45678',
      address: '42 Orchid Heights, Park Street, Metropolis',
      driverLicense: 'DL-IND-2022-98421',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    });

    const customerUser2 = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah@example.com',
      password: 'password123',
      role: 'user',
      phone: '+91 98987 65432',
      address: '74 Greenfield Boulevard, Tech District',
      driverLicense: 'DL-IND-2023-11209',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    });

    console.log('Seeding Categories...');
    const createdCategories = await Category.insertMany(categoriesData);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    console.log('Seeding Vehicles...');
    const vehiclesWithCategories = vehiclesData(categoryMap);
    const createdVehicles = await Vehicle.insertMany(vehiclesWithCategories);

    console.log('Seeding Sample Bookings & Payments...');
    // Create 3 sample bookings for John and Sarah to show live stats
    const today = new Date();
    
    // Booking 1: Completed rental
    const b1Pickup = new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000);
    const b1Return = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const b1Days = 3;
    const b1Vehicle = createdVehicles[0]; // BMW
    const b1RentalCost = b1Days * b1Vehicle.rentalPricePerDay;
    const b1Tax = Math.round(b1RentalCost * 0.12);
    const b1Total = b1RentalCost + b1Tax;

    const booking1 = await Booking.create({
      bookingId: 'VRMS-202611-B101',
      user: customerUser1._id,
      vehicle: b1Vehicle._id,
      pickupDate: b1Pickup,
      returnDate: b1Return,
      totalDays: b1Days,
      pricePerDay: b1Vehicle.rentalPricePerDay,
      rentalCost: b1RentalCost,
      taxesAndFees: b1Tax,
      totalAmount: b1Total,
      status: 'Completed',
      paymentStatus: 'Paid',
      pickupLocation: 'Airport Terminal 3 Hub',
      returnLocation: 'Airport Terminal 3 Hub',
      driverInfo: {
        fullName: customerUser1.name,
        email: customerUser1.email,
        phone: customerUser1.phone,
        licenseNumber: customerUser1.driverLicense,
      },
    });

    await Payment.create({
      paymentId: 'PAY-9000101',
      receiptNumber: 'RCP-500101',
      booking: booking1._id,
      user: customerUser1._id,
      amount: b1Total,
      paymentMethod: 'Credit Card',
      paymentStatus: 'Completed',
      transactionId: 'TXN-BMW-98129841',
      paidAt: b1Pickup,
      billingDetails: {
        name: customerUser1.name,
        email: customerUser1.email,
        phone: customerUser1.phone,
        address: customerUser1.address,
      },
    });

    // Booking 2: Active rental
    const b2Pickup = new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000);
    const b2Return = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    const b2Days = 4;
    const b2Vehicle = createdVehicles[2]; // Tesla Model 3
    const b2RentalCost = b2Days * b2Vehicle.rentalPricePerDay;
    const b2Tax = Math.round(b2RentalCost * 0.12);
    const b2Total = b2RentalCost + b2Tax;

    const booking2 = await Booking.create({
      bookingId: 'VRMS-202611-T202',
      user: customerUser2._id,
      vehicle: b2Vehicle._id,
      pickupDate: b2Pickup,
      returnDate: b2Return,
      totalDays: b2Days,
      pricePerDay: b2Vehicle.rentalPricePerDay,
      rentalCost: b2RentalCost,
      taxesAndFees: b2Tax,
      totalAmount: b2Total,
      status: 'Active',
      paymentStatus: 'Paid',
      pickupLocation: 'Tech Park Central',
      returnLocation: 'Tech Park Central',
      driverInfo: {
        fullName: customerUser2.name,
        email: customerUser2.email,
        phone: customerUser2.phone,
        licenseNumber: customerUser2.driverLicense,
      },
    });

    await Payment.create({
      paymentId: 'PAY-9000202',
      receiptNumber: 'RCP-500202',
      booking: booking2._id,
      user: customerUser2._id,
      amount: b2Total,
      paymentMethod: 'UPI / NetBanking',
      paymentStatus: 'Completed',
      transactionId: 'TXN-TSLA-77412985',
      paidAt: b2Pickup,
      billingDetails: {
        name: customerUser2.name,
        email: customerUser2.email,
        phone: customerUser2.phone,
        address: customerUser2.address,
      },
    });

    // Booking 3: Upcoming confirmed rental
    const b3Pickup = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
    const b3Return = new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000);
    const b3Days = 3;
    const b3Vehicle = createdVehicles[1]; // Audi Q7
    const b3RentalCost = b3Days * b3Vehicle.rentalPricePerDay;
    const b3Tax = Math.round(b3RentalCost * 0.12);
    const b3Total = b3RentalCost + b3Tax;

    const booking3 = await Booking.create({
      bookingId: 'VRMS-202611-A303',
      user: customerUser1._id,
      vehicle: b3Vehicle._id,
      pickupDate: b3Pickup,
      returnDate: b3Return,
      totalDays: b3Days,
      pricePerDay: b3Vehicle.rentalPricePerDay,
      rentalCost: b3RentalCost,
      taxesAndFees: b3Tax,
      totalAmount: b3Total,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      pickupLocation: 'Downtown Corporate Center',
      returnLocation: 'Airport Terminal 3 Hub',
      driverInfo: {
        fullName: customerUser1.name,
        email: customerUser1.email,
        phone: customerUser1.phone,
        licenseNumber: customerUser1.driverLicense,
      },
    });

    await Payment.create({
      paymentId: 'PAY-9000303',
      receiptNumber: 'RCP-500303',
      booking: booking3._id,
      user: customerUser1._id,
      amount: b3Total,
      paymentMethod: 'Credit Card',
      paymentStatus: 'Completed',
      transactionId: 'TXN-AUDI-33829140',
      paidAt: new Date(),
      billingDetails: {
        name: customerUser1.name,
        email: customerUser1.email,
        phone: customerUser1.phone,
        address: customerUser1.address,
      },
    });

    console.log('✅ Database seeded successfully!');
    console.log('----------------------------------------------------');
    console.log('Admin Account:    admin@vrms.com     / admin123');
    console.log('Customer Account: john@example.com   / password123');
    console.log('Customer Account: sarah@example.com  / password123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    console.log('Destroying all collections...');
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Vehicle.deleteMany(),
      Booking.deleteMany(),
      Payment.deleteMany(),
    ]);
    console.log('Database wiped clean.');
    process.exit(0);
  } catch (error) {
    console.error(`[Destroy Error]: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
