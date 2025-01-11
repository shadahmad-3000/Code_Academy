import Message from "../models/messages.model.js";
import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";
import {
  uploadAudio,
  uploadDocuments,
  uploadImage,
} from "../libs/cloudinary.js"; // Import Cloudinary Function
import { Buffer } from "buffer";

export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  try {
    // Retrieve messages in descending order
    const messages = await Message.find({ chatId })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // Reverses the order of messages before sending them to the client
    const orderedMessages = messages.reverse();
    console.log(orderedMessages);
    res.json(orderedMessages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching messages" });
  }
};

// In the controller
export const addMessage = async (req, res) => {
  try {
    console.log("Body", req.body);
    const { chatId, sender, text, type } = req.body; // We use 'text' and 'type'

    console.log("Data received:", { chatId, sender, text, type });

    let erroresNotificaciones = [];

    if (!chatId || !sender || (!text && !req.body.file)) {
      console.log("Data is missing to send the message.");
      return res
        .status(400)
        .json({ error: "Data is missing to send the message." });
    }

    const chat = await Chat.findById(chatId).populate("participants");
    if (!chat) {
      console.log("Chat not found.");
      return res.status(404).json({ error: "Chat not found." });
    }

    const senderIsParticipant = chat.participants.some(
      (participant) => participant._id.toString() === sender
    );
    if (!senderIsParticipant) {
      console.log("The sender is not a chat participant.");
      return res
        .status(403)
        .json({ error: "The sender is not a participant in this chat." });
    }

    let messageContent = text;

    if (req.body.file) {
      try {
        console.log(
          "File received for upload:",
          req.body.file.substring(0, 100)
        ); // Display only part of the base64 file for safety
        const fileBuffer = Buffer.from(req.body.file, "base64");
        console.log(
          "File converted to buffer with size:",
          fileBuffer.length
        );

        let uploadResult;

        // Use the appropriate function for the file type
        if (type === "image") {
          uploadResult = await uploadImage(fileBuffer);
        } else if (type === "document") {
          uploadResult = await uploadDocuments(fileBuffer);
        } else if (type === "audio") {
          uploadResult = await uploadAudio(fileBuffer);
        }

        if (uploadResult) {
          messageContent = uploadResult;
        } else {
          throw new Error("Error uploading file to Cloudinary");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        if (error.http_code && error.http_code === 400) {
          console.error("Error 400 details:", error);
          return res
            .status(400)
            .json({
              error: "Error uploading file to Cloudinary",
              detalles: error.message,
            });
        } else {
          console.error("Internal error while uploading file:", error);
          return res
            .status(500)
            .json({ error: "Internal server error while uploading file" });
        }
      }
    }

    const message = new Message({
      chatId,
      sender,
      content: messageContent,
      type: type || "text",
    });
    await message.save();

    console.log("Saved message:", message);
    // Send successful response only if no errors
    return res.status(200).json(message);
  } catch (error) {
    console.error("Error in add Message:", error);
    return res
      .status(500)
      .json({ error: "Internal server error while sending message." });
  }
};
