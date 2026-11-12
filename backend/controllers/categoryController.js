import Category from '../models/Category.js';
import Vehicle from '../models/Vehicle.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const { includeInactive } = req.query;
    const filter = includeInactive === 'true' ? {} : { isActive: true };
    const categories = await Category.find(filter).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, icon } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const categoryExists = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (categoryExists) {
      return res.status(400).json({ success: false, message: 'Category already exists.' });
    }

    const category = await Category.create({
      name,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
      icon: icon || 'car',
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
  try {
    const { name, description, image, icon, isActive } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (icon !== undefined) category.icon = icon;
    if (isActive !== undefined) category.isActive = isActive;

    const updatedCategory = await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
      category: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    // Check if any vehicles belong to this category
    const vehicleCount = await Vehicle.countDocuments({ category: req.params.id });
    if (vehicleCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category: ${vehicleCount} vehicle(s) are currently assigned to it. Reassign them first.`,
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
