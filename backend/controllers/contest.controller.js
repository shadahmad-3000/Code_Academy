import Contest from '../models/contest.model.js';

export const createContest = async (req, res) => {
  try {
    const { title, platformName, startDate, endDate, link, description, userId } = req.body;
    
    // Simple validations
    if (!title) {
      return res.status(400).json({ message: 'The title is required and must be text.' });
    }
    
    if (!platformName) {
      return res.status(400).json({ message: 'The platform name is required and must be text.' });
    }
    
    if (!startDate) {
      return res.status(400).json({ message: 'The start date is required and must be a valid date.' });
    }
    
    if (!endDate) {
      return res.status(400).json({ message: 'The end date is required and must be a valid date.' });
    }
    
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'The start date must be before the end date.' });
    }
    
    if (!link) {
      return res.status(400).json({ message: 'The link is required and must be text.' });
    }
    
    if (!userId) {
      return res.status(400).json({ message: 'The creator ID is required.' });
    }
    
    // Contest creation
    const contestData = {
      title,
      platformName,
      startDate,
      endDate,
      link,
      description,
      createdBy: userId,
    };
    
    const newContest = new Contest(contestData);
    await newContest.save();
    
    res.status(201).json({
      success: true,
      message: 'Contest created successfully',
      contests: newContest,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An error occurred on the server." });
  }
};

export const getAllContests = async (req, res, next) => {
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

    // Find contests with pagination
    const contests = await Contest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email');

    // Get total count for pagination
    const total = await Contest.countDocuments(filter);

    res.json({
      success: true,
      contests,
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

export const getContestById = async (req, res, next) => {
  try {
    const contest = await Contest.findById(req.params.id).populate('createdBy', 'name email');
    
    if (!contest) {
      return next(createHttpError(404, 'Contest not found'));
    }

    res.json({
      success: true,
      contest
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error." });
  }
};

export const updateContest = async (req, res, next) => {
  try {
    const contestId = req.params.id;

    // Find the contest and check if the user is the creator
    const contest = await Contest.findById(contestId);
    
    if (!contest) {
      return next(createHttpError(404, 'Contest not found'));
    }

    // Ensure only the creator can update
    if (contest.createdBy.toString() !== req.user._id.toString()) {
      return next(createHttpError(403, 'You are not authorized to update this contest'));
    }

    // Update the contest
    const updatedContest = await Contest.findByIdAndUpdate(
      contestId, 
      req.body, 
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Contest updated successfully',
      contest: updatedContest
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error." });
  }
};

export const deleteContest = async (req, res) => {
  try {
    const contestId = req.params.id;

    // Search the contest by ID
    const contest = await Contest.findById(contestId);

    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    // Delete the contest
    await Contest.findByIdAndDelete(contestId);

    res.status(200).json({
      success: true,
      message: 'Contest deleted successfully',
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An error occurred." });
  }
};
