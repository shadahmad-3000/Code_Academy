import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AdminNavbar from "@/components/Navbars/AdminNavbar.jsx";
import { useChats } from "@/context/chatContext.jsx";
import { useAuth } from "@/context/authContext.jsx";

import {
  Send,
  User,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Phone,
  Video,
  ArrowLeft,
  Plus,
  X,
  Check
} from 'lucide-react';
import img0 from "@/assets/img/team-4.png"
import Sidebar from "@/components/Sidebar/Sidebar.jsx";

const CreateChatModal = ({
  isOpen,
  onClose,
  onCreateChat
}) => {
  const {
    isAuthenticated,
    getAllTeachers,
    allTeachers
  } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfessor, setSelectedProfessor] = useState(null);

  // Memoize filtered professors to improve performance
  const filteredProfessors = useMemo(() =>
    allTeachers.filter(prof =>
      prof?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    ),
    [allTeachers, searchTerm]
  );

  // Fetch teachers when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      try {
        getAllTeachers();
      } catch (error) {
        console.error('Error fetching teachers:', error);
        // Optionally show an error toast/notification
      }
    }
  }, [isAuthenticated]);

  const handleProfessorSelect = (professor) => {
    // Only allow selecting one professor
    setSelectedProfessor(prev =>
      prev?._id === professor._id ? null : professor
    );
  };

  const handleCreateChat = () => {
    if (selectedProfessor) {
      onCreateChat([selectedProfessor]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-chat-title"
    >
      <div className="bg-[#1A1A2E] rounded-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2
            id="create-chat-title"
            className="text-xl font-bold text-white"
          >
            Create New Chat
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-white/50 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search professors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="Search professors"
            />
            <Search className="absolute right-4 top-3 text-white/50" size={20} />
          </div>
        </div>

        {/* Professors List */}
        <div className="max-h-64 overflow-y-auto">
          {filteredProfessors.length === 0 ? (
            <p className="text-center text-white/50 p-4">No professors found</p>
          ) : (
            filteredProfessors.map((professor) => (
              <div
                key={professor._id}
                onClick={() => handleProfessorSelect(professor)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && handleProfessorSelect(professor)}
                className={`
                  flex items-center p-4 cursor-pointer transition-all duration-300
                  ${selectedProfessor?._id === professor._id
                    ? 'bg-gradient-to-r from-purple-600/30 to-cyan-600/30'
                    : 'hover:bg-white/10'}
                `}
              >
                <img
                  src={professor.profileImage || img0}
                  alt={professor.name || 'Professor'}
                  className="w-10 h-10 rounded-full mr-4 object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-white">
                    {professor.name || 'Unnamed Professor'}
                  </h3>
                </div>
                {selectedProfessor?._id === professor._id && (
                  <Check className="text-cyan-400" size={20} />
                )}
              </div>
            ))
          )}
        </div>

        {/* Create Chat Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleCreateChat}
            disabled={!selectedProfessor}
            aria-label={
              !selectedProfessor
                ? 'Select a professor'
                : 'Create chat'
            }
            className={`
              w-full py-3 rounded-full text-white font-semibold transition-all duration-300
              ${selectedProfessor
                ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90'
                : 'bg-white/10 cursor-not-allowed opacity-50'}
            `}
          >
            {selectedProfessor
              ? 'Create Chat'
              : 'Select a Professor'}
          </button>
        </div>
      </div>
    </div>
  );
};

const MessageBubble = ({ message }) => {
  const { user } = useAuth(); // Get the current user
  const isCurrentUser = message.sender === user._id; // Compare sender with user id

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`
        max-w-[70%] p-3 rounded-2xl
        ${isCurrentUser
          ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
          : 'bg-white/10 text-white border border-white/20'}
      `}>
        <p className="text-sm">{message.content}</p>
        <div className="text-xs text-white/70 mt-1 text-right">
          {new Date(message.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

const Messages = () => {
  const navigate = useNavigate();
  const {
    messages,
    fetchChats,
    fetchMessages,
    sendMessage,
    chats,
    createChat
  } = useChats();

  const {
    user, isAuthenticated
  } = useAuth();

  const { chatId } = useParams();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showConversationList, setShowConversationList] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // New state for create chat modal
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);
  const [professors, setProfessors] = useState([]); // Placeholder for professors list

  // Effect to automatically open create chat modal if route is /messages/create


  // Simplified and more robust effects
  useEffect(() => {
    if (isAuthenticated) {
      fetchChats();
    }
  }, [isAuthenticated, fetchChats]); // Add fetchChats to dependencies



  const handleCreateNewChat = async (selectedProfessors) => {
    try {
      // Create chat with selected professors
      const newChat = await createChat(selectedProfessors.map(p => p._id));
      if (newChat) {
        setSelectedConversation(newChat);
        setShowConversationList(false);
        setIsCreateChatModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to create chat', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && chatId) {
      const fetchChatMessages = async () => {
        try {
          // Fetch messages first
          await fetchMessages(chatId);

          // Then find and set the selected conversation
          const conversation = chats.find(chat => chat._id === chatId);
          if (conversation) {
            setSelectedConversation(conversation);
          }
        } catch (error) {
          console.error('Failed to fetch chat messages', error);
        }
      };

      fetchChatMessages();
    }
  }, [chatId, isAuthenticated, fetchMessages, chats]); // More comprehensive dependencies

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const messagePayload = {
        chatId: selectedConversation._id,
        sender: user._id, // Add the current user's ID as the sender
        text: newMessage, // Use 'text' instead of 'content'
        type: 'text' // Explicitly set the type
      };

      await sendMessage(messagePayload);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  // Improved method for selecting conversation
  const handleConversationSelect = async (conv) => {
    try {
      // Set selected conversation
      setSelectedConversation(conv);

      // Hide conversation list
      setShowConversationList(false);

      // Load messages from the selected chat
      await fetchMessages(conv._id);

    } catch (error) {
      console.error('Error al seleccionar conversación:', error);
    }
  };

  const handleBackToConversations = () => {
    setShowConversationList(true);
  };

  return (
    <>
      <CreateChatModal
        isOpen={isCreateChatModalOpen}
        onClose={() => setIsCreateChatModalOpen(false)}
        professors={professors}
        onCreateChat={handleCreateNewChat}
      />
      <main className="relative overflow-hidden bg-[#0A0A1E] min-h-screen pt-0">
        {/* Background gradients similar to dashboard */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-teal-900/30 transition-all duration-1000" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0),rgba(17,24,39,1))] transition-all duration-1000" />
        </div>

        <div className="relative container mx-auto px-4 py-4 flex flex-col">
          <div className="w-full md:w-1/4 mb-4 md:mb-0 md:hidden">
            <Sidebar />
          </div>
          <div className="w-full mb-4">
            <AdminNavbar nav="Messages" />
          </div>

          <div className="flex flex-1 h-[calc(100vh-100px)] flex-col md:flex-row">
            {/* Conversations Sidebar - Mobile & Desktop */}
            <div className={`
              ${showConversationList ? 'block' : 'hidden'} 
              md:block w-full md:w-1/4 md:pr-6 md:border-r md:border-white/10
            `}>
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
                  Messages
                </h2>
                <button
                  onClick={() => setIsCreateChatModalOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-full p-2 hover:opacity-90 transition-opacity"
                >
                  <Plus size={20} />
                </button>
              </div>
              {/* Search Bar */}
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search conversations"
                  className="w-full bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <Search className="absolute right-4 top-3 text-white/50" size={20} />
              </div>

              {/* Conversation List */}
              <div className="p-6">
                {isLoading ? (
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chats.length === 0 ? (
                      <p className="text-center text-white/50">No conversations yet</p>
                    ) : (
                      chats.map((conv) => (
                        <Link
                          key={conv._id}
                          onClick={() => handleConversationSelect(conv)}
                        >
                          <div
                            className={`
                              flex items-center p-4 rounded-2xl cursor-pointer transition-all duration-300
                              ${selectedConversation?._id === conv._id
                                ? 'bg-gradient-to-r from-purple-600/30 to-cyan-600/30'
                                : 'hover:bg-white/10'}
                            `}
                          >
                            <div className="relative mr-4">
                              <img
                                src={img0} // You might want to add logic to get a profile image
                                alt={conv.chatName || 'Conversation'}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              {/* Uncomment if you have unread count logic */}
                              {/* {conv.unreadCount > 0 && (
                                <span className="absolute bottom-0 right-0 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                  {conv.unreadCount}
                                </span>
                              )} */}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-white">{conv.chatName || 'Unknown'}</h3>
                              <p className="text-sm text-white/50 truncate">
                                {conv.lastMessage?.text || 'No messages'}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Message Window - Mobile & Desktop */}
            <div className={`
              ${showConversationList ? 'hidden' : 'block'} 
              md:block w-full md:w-3/4 md:pl-6 flex flex-col
            `}>
              {selectedConversation ? (
                <>
                  {/* Chat Header with Mobile Back Button */}
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                    <div className="flex items-center">
                      <button
                        onClick={handleBackToConversations}
                        className="md:hidden mr-4"
                      >
                        <ArrowLeft className="text-white" size={24} />
                      </button>
                      <img
                        src={selectedConversation.profileImage || img0}
                        alt={selectedConversation.chatName || 'Conversation'}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {selectedConversation.chatName || 'Conversation'}
                        </h3>
                        <p className="text-sm text-white/50">Active now</p>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <MoreVertical className="text-white/50 hover:text-white cursor-pointer" size={24} />
                    </div>
                  </div>

                  {/* Message Area */}
                  <div className="flex-1 overflow-y-auto pr-4 mb-6">
                    {messages.length > 0 ? (
                      messages
                        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                        .map((message) => (
                          <MessageBubble
                            key={message._id}
                            message={{
                              ...message,
                              sender: message.sender.toString(), // Convert ObjectId if necessary
                              content: message.content,
                              createdAt: message.createdAt
                            }}
                          />
                        ))
                    ) : (
                      <div className="no-messages">
                        No hay mensajes en esta conversación
                      </div>
                    )}

                  </div>

                  {/* Message Input */}
                  <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center space-x-4">
                      <Paperclip className="text-white/50 hover:text-white cursor-pointer" size={24} />
                      <Smile className="text-white/50 hover:text-white cursor-pointer" size={24} />

                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent text-white placeholder-white/50 focus:outline-none"
                      />

                      <button
                        onClick={handleSendMessage}
                        className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-full p-2 hover:opacity-90 transition-opacity"
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-white/50">
                  <p>Select a conversation or start a new chat</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Messages;