import Opportunities from '../models/opportunities.model.js';

export const createOpportunities = async (req, res) => {
  try {
    const { title, description, link, userId } = req.body;
    
    // Simple validations
    if (!title) {
      return res.status(400).json({ message: 'The title is required and must be text.' });
    }

    if (!description) {
      return res.status(400).json({ message: 'The description is required and must be text.' });
    }
    
    if (!link) {
      return res.status(400).json({ message: 'The link is required and must be text.' });
    }
    
    if (!userId) {
      return res.status(400).json({ message: 'The creator ID is required.' });
    }
    
    // Oportunities creation
    const opportunitiesData = {
      title,
      description,
      link,
      createdBy: userId,
    };
    
    const newOpportunities = new Opportunities(opportunitiesData);
    await newOpportunities.save();
    
    res.status(201).json({
      success: true,
      message: 'Opportunities created successfully',
      opportunities: newOpportunities,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An error occurred on the server." });
  }
};

export const getAllOpportunities = async (req, res, next) => {
  try {
    // Get query parameters for pagination and filtering
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Optional filtering by platformName or other criteria
    const filter = {};
    if (req.query.platformName) {
      filter.platformName = { $regex: req.query.platformName, $options: 'i' };
    }

    // Find opportunities
    const opportunities = await Opportunities.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email');

    // Get total count
    const total = await Opportunities.countDocuments(filter);

    res.json({
      success: true,
      opportunities,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalContests: total
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error." });
  }
};

export const getOpportunitiesById = async (req, res, next) => {
  try {
    const opportunities = await Opportunities.findById(req.params.id).populate('createdBy', 'name email');
    
    if (!opportunities) {
      return next(createHttpError(404, 'Opportunities not found'));
    }

    res.json({
      success: true,
      opportunities
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error." });
  }
};

export const updateOpportunities = async (req, res, next) => {
  try {
    const opportunitiesId = req.params.id;

    // Find the contest and check if the user is the creator
    const opportunities = await Opportunities.findById(opportunitiesId);
    
    if (!opportunities) {
      return next(createHttpError(404, 'Contest not found'));
    }

    // Update the contest
    const updatedContest = await Opportunities.findByIdAndUpdate(
      opportunitiesId, 
      req.body, 
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Opportunities updated successfully',
      opportunities: updatedContest
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error." });
  }
};

export const deleteOpportunities = async (req, res) => {
  try {
    const opportunitiesId = req.params.id;

    // Search the contest by ID
    const opportunities = await Opportunities.findById(opportunitiesId);

    if (!opportunities) {
      return res.status(404).json({ message: 'Opportunities not found' });
    }

    // Delete the contest
    await Opportunities.findByIdAndDelete(opportunitiesId);

    res.status(200).json({
      success: true,
      message: 'Opportunities deleted successfully',
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An error occurred." });
  }
};
