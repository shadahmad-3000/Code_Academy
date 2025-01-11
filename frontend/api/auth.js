import axios from "@/api/axios.js";

export const registerRequest = async (user) =>
  axios.post(`/auth/signup`, user);

export const createNewAdminRequest = async (user) =>
  axios.post(`/users/create-new-admin`, user);

export const bulkVerifiedRequest = async (user) =>
  axios.put(`/users/bulk-verified`, user);

export const verifiedRequest = async (id) =>
  axios.put(`/users/verified/${id}`);

export const loginRequest = async (user) => axios.post(`/auth/signin`, user);

export const completUserRequest = async (user, id) => axios.put(`/auth/complete-registration/${id}`, user);

export const editUserProfileRequest = async (user, id) => axios.put(`/users/update-profile/${id}`, user);

export const verifyTokenRequest = async (token) => {
  try {
    const response = await axios.get('/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`, 
      },
    });
    return response;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error; 
  }
};

export const allAdminsRequest = async (id) => axios.get(`/users/admins/all`);

export const allTeachersRequest = async (id) => axios.get(`/users/teachers/all`);

export const changePasswordRequest = async (values) => axios.post(`/auth/change-password`, values);

export const usersAdminRequest = async (idcard) => axios.post(`/users/users-admin/${idcard}`);

export const createAssignmentRequest = async (values) => axios.post(`/assignments/create`, values);

export const getAssignmentByIdRequest = async (id) => axios.get(`/assignments/${id}`);

export const getAssignmentByCourseRequest = async (id) => axios.get(`/assignments/course/${id}`);

export const updateAssignmentRequest = async (values, id) => axios.post(`/assignments/update/${id}`, values);

export const deleteAssignmentRequest = async (id) => axios.delete(`/assignments/delete/${id}`);

export const fetchChatsRequest = async (userId) =>
  axios.get(`/chat/${userId}`);

export const createChatRequest = async (userId, participants) =>
  axios.post(`/chat?userId=${userId}`, {
    participants
  });

export const sendAIMessageRequest = async (prompt, userId) => 
  axios.post(`/chat/ai`, {
  prompt,
  userId: userId
});

export const fetchAIMessagesRequest = async (userId) => 
  axios.get(`/chat/ai/${userId}`);

export const fetchMessagesRequest = async (chatId, page = 1, limit = 20) => 
  axios.get(`/messages/getmsg/${chatId}?page=${page}&limit=${limit}`);

export const sendMessageRequest = async (messagePayload) => 
  axios.post(`/messages/addmsg`, messagePayload, {
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createContestRequest = async (values) => axios.post(`/contest`, values);

export const deleteContestRequest = async (id) => axios.delete(`/contest/delete/${id}`);

export const getContestRequest = async () => axios.get(`/contest`);

export const createOpportunitiesRequest = async (values) => axios.post(`/opportunities`, values);

export const deleteOpportunitiesRequest = async (id) => axios.delete(`/opportunities/delete/${id}`);

export const getOpportunitiesRequest = async () => axios.get(`/opportunities`);