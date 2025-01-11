import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "@/context/authContext.jsx";
import {
  fetchChatsRequest,
  createChatRequest,
  sendAIMessageRequest,
  fetchAIMessagesRequest,
  fetchMessagesRequest,
  sendMessageRequest
} from "@/api/auth.js";

const MESSAGES_PER_PAGE = 20;

const ChatContext = createContext();

export const useChats = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within an ChatProvider");
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user, socket } = useAuth();

  // Group all state declarations together
  const [isInitialized, setIsInitialized] = useState(false);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState(new Map());
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize user effect
  useEffect(() => {
    if (user) {
      setIsInitialized(true);
    }
  }, [user]);

  // Socket effect
  useEffect(() => {
    if (!socket?.current) return;

    const handleNewMessage = (newMessage) => {
      setMessages((prevMessages) => {
        const exists = prevMessages.some((msg) => msg._id === newMessage._id);
        if (!exists) {
          return [...prevMessages, newMessage];
        }
        return prevMessages;
      });
    };

    const handleTyping = ({ chatId, typingUsers }) => {
      setTypingStatus(prevStatus => new Map(prevStatus).set(chatId, new Set(typingUsers)));
    };

    const handleStopTyping = ({ chatId, typingUsers }) => {
      setTypingStatus(prevStatus => {
        const updatedStatus = new Map(prevStatus);
        if (typingUsers.length === 0) {
          updatedStatus.delete(chatId);
        } else {
          updatedStatus.set(chatId, new Set(typingUsers));
        }
        return updatedStatus;
      });
    };

    const handleUserOnline = ({ userId, onlineUsers }) => {
      setOnlineUsers(new Set(onlineUsers));
    };

    const handleUserOffline = ({ userId, onlineUsers }) => {
      setOnlineUsers(new Set(onlineUsers));
    };

    socket.current.on("msg-recieve", handleNewMessage);
    socket.current.on("typing", handleTyping);
    socket.current.on("stop-typing", handleStopTyping);
    socket.current.on('user-online', handleUserOnline);
    socket.current.on('user-offline', handleUserOffline);

    return () => {
      if (socket.current) {
        socket.current.off("msg-recieve", handleNewMessage);
        socket.current.off("typing", handleTyping);
        socket.current.off("stop-typing", handleStopTyping);
        socket.current.off("user-online", handleUserOnline);
        socket.current.off("user-offline", handleUserOffline);
      }
    };
  }, [socket?.current]);

  const fetchChats = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetchChatsRequest(user._id);
      setChats(response.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  }, [user]);

  const createChat = async (participants) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const response = await createChatRequest(user._id, participants);
      setChats((prevChats) => [...prevChats, response]);
      return response;
    } catch (error) {
      console.error("Error creating chat:", error);
      throw error;
    }
  };

  const messagesAi = async (prompt) => {
    try {
      return await sendAIMessageRequest(prompt, user._id);
    } catch (error) {
      console.error("Error sending AI message:", error);
      throw error;
    }
  };

  const fetchMessagesAi = async () => {
    try {
      const data = await fetchAIMessagesRequest(user._id);
      return data;
    } catch (error) {
      console.error('Error fetching AI messages:', error);
      throw error;
    }
  };

  const fetchMessages = useCallback(async (chatId) => {
    try {
      const response = await fetchMessagesRequest(chatId, 1, MESSAGES_PER_PAGE);

      // Correctly access messages
      const messagesData = response.data;

      if (messagesData.length > 0) {
        // Reverse the order of messages to show the most recent ones first
        setMessages(messagesData.reverse());
        setCurrentPage(1);

        // Determine if there are more messages to load
        setHasMoreMessages(messagesData.length === MESSAGES_PER_PAGE);
      } else {
        setHasMoreMessages(false);
      }

      if (socket.current) {
        socket.current.emit("joinChat", chatId);
      }
    } catch (error) {
      console.error('Error in fetching messages:', error);
    }
  }, [socket]);

  const loadMoreMessages = async (chatId) => {
    if (!hasMoreMessages) return;

    try {
      const nextPage = currentPage + 1;
      const data = await fetchMessagesRequest(chatId, nextPage, MESSAGES_PER_PAGE);

      if (data.length > 0) {
        setMessages(prevMessages => [...prevMessages, ...data.reverse()]);
        setCurrentPage(nextPage);
        setHasMoreMessages(data.length === MESSAGES_PER_PAGE);
      } else {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error('Error in loading more messages:', error);
      throw error;
    }
  };

  const sendMessage = async (messagePayload) => {
    try {
      setIsLoading(true);

      // Make the request to send the message
      const response = await sendMessageRequest(messagePayload);

      // Access data nested in response.data
      const formattedResponse = {
        ...response.data,
        sender: response.data.sender.toString(), // Convert ObjectId if necessary
      };

      // Adds the message to the list if it is not already present
      if (!messages.some((msg) => msg._id === formattedResponse._id)) {
        setMessages((prevMessages) => [...prevMessages, formattedResponse]);
      }

      // Emits the message to the socket server if configured
      if (socket.current) {
        socket.current.emit("send-msg", formattedResponse);
      }

      return formattedResponse;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };


  const notifyTyping = ({ userId, chatId }) => {
    if (socket.current) {
      socket.current.emit("typing", { userId, chatId });
    }
  };

  const stopTyping = ({ userId, chatId }) => {
    if (socket.current) {
      socket.current.emit("stop-typing", { userId, chatId });
    }
  };

  return (
    <ChatContext.Provider value={{
      chats,
      messages,
      setMessages,
      typingStatus,
      onlineUsers,
      isLoading,
      fetchChats,
      createChat,
      fetchMessages,
      sendMessage,
      notifyTyping,
      stopTyping,
      loadMoreMessages,
      messagesAi,
      fetchMessagesAi
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;