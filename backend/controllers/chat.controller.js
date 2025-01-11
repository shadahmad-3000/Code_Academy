import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";
import Message from '../models/messages.model.js';
import mongoose from "mongoose";

export const createChat = async (req, res) => {
  try {
    const { userId } = req.query;

    const { participants } = req.body;

    // Validate userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Validate all participant IDs
    const participantIds = [userId, ...participants].map(id => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid participant ID: ${id}`);
      }
      return new mongoose.Types.ObjectId(id);
    });

    // Check if all participants exist
    const users = await User.find({ _id: { $in: participantIds } });
    
    if (users.length !== participantIds.length) {
      const existingUserIds = users.map(user => user._id.toString());
      const missingUsers = participantIds
        .filter(id => !existingUserIds.includes(id.toString()));
      
      return res.status(400).json({ 
        message: `The following user IDs do not exist: ${missingUsers.join(", ")}`
      });
    }

    // Determine if it's a group chat
    const isGroupChat = participantIds.length > 2;

    // Only search for existing chat if there are exactly two participants
    if (participantIds.length === 2) {
      const existingChat = await Chat.findOne({
        participants: { $all: participantIds, $size: 2 },
      });
      
      if (existingChat) {
        return res.status(400).json({ message: "A chat between these participants already exists." });
      }
    }

    // Create new chat
    let chat = new Chat({
      chatName: isGroupChat ? req.body.chatName || null : null,
      participants: participantIds
    });
    await chat.save();

    // Get participants details
    const participantsDetails = await User.find({ 
      _id: { $in: participantIds } 
    }).select('_id name').lean();

    // If no chat name and it's a two-person chat, use the other participant's first name
    let chatResponseName = req.body.chatName;
    if (!chatResponseName && chat.participants.length === 2) {
      const otherParticipant = participantsDetails.find(
        p => p._id.toString() !== userObjectId.toString()
      );
      chatResponseName = otherParticipant ? otherParticipant.name : "Unnamed Chat";
    }

    // Construct response
    const chatResponse = {
      _id: chat._id,
      participants: participantsDetails,
      chatName: chatResponseName
    };

    res.json(chatResponse);

  } catch (err) {
    console.error('Error in createChat:', err.message);
    res.status(500).json({ error: err.message });
  }
};

export const findChat = async (req, res) => {
  const { userId } = req.params;

  try {
    // Verify if userId is valid and convert to ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID." });
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find chats where userId is in the participants array
    const chats = await Chat.find({ participants: userObjectId }).lean();

    // Check if any chats were found
    if (chats.length === 0) {
      return res.status(404).json({ error: "No chats found for the user" });
    }

    for (const chat of chats) {
      // Find participants' names
      const participantsWithNames = await User.find({ 
        _id: { $in: chat.participants } 
      }).select('_id name').lean();

      // Map participants to include _id and name
      chat.participants = chat.participants.map(participantId => {
        const user = participantsWithNames.find(
          p => p._id.toString() === participantId.toString()
        );
        return {
          _id: participantId,
          name: user ? user.name : "Unnamed User"
        };
      });

      // If no chatName and it's a two-person chat, use the other participant's name
      if (!chat.chatName && chat.participants.length === 2) {
        const otherParticipant = chat.participants.find(
          p => p._id.toString() !== userId
        );
        chat.chatName = otherParticipant ? otherParticipant.name : "Unnamed Chat";
      }

      // Find the last message for the chat
      const lastMessage = await Message.findOne({ chatId: chat._id })
        .sort({ createdAt: -1 })
        .lean();
      
      chat.lastMessage = lastMessage;
    }
    res.json(chats);
  } catch (err) {
    console.error('Error in findChat:', err);
    res.status(500).json({ error: err.message });
  }
};