import { useEffect } from "react";
import { ME_LOCALHOST_KEY, SOCKET_URL } from "@/config.js";
import { createContext, useContext, useState, useCallback, useRef } from "react";
import {
  loginRequest,
  registerRequest,
  verifyTokenRequest,
  createNewAdminRequest,
  bulkVerifiedRequest,
  verifiedRequest,
  usersAdminRequest,
  allAdminsRequest,
  changePasswordRequest,
  completUserRequest,
  editUserProfileRequest,
  allTeachersRequest,
  createAssignmentRequest,
  updateAssignmentRequest,
  deleteAssignmentRequest,
  getAssignmentByIdRequest,
  getAssignmentByCourseRequest,
  createContestRequest,
  deleteContestRequest,
  getContestRequest,
  createOpportunitiesRequest,
  deleteOpportunitiesRequest,
  getOpportunitiesRequest,
} from "@/api/auth.js";
import { io } from 'socket.io-client';
import { showSuccess, showError, showWarning } from '@/components/ui/showToast.jsx';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {

  const [onlineUsers, setOnlineUsers] = useState(new Map());
  const socket = useRef(null);

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allAdmins, setAllAdmins] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [idCourses, setIdCourses] = useState([]);
  const [idCoursesTeacher, setIdCoursesTeacher] = useState([]);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  const [verified, setVerified] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [contests, setContests] = useState([]);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  // clear errors after 5 seconds
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const handleUserOnline = (userId) => {
    setOnlineUsers((prev) => new Map(prev).set(userId, true));
  };

  const handleUserOffline = (userId) => {
    setOnlineUsers((prev) => {
      const newMap = new Map(prev);
      newMap.delete(userId);
      return newMap;
    });
  };

  const initializeSocket = () => {
    if (!socket.current) {
      socket.current = io(SOCKET_URL, {
        transports: ['websocket'],
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });

      socket.current.on("connect", () => {
        if (user) {
          socket.current.emit("add-user", user._id);
        }
      });

      socket.current.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      socket.current.on("user-online", handleUserOnline);
      socket.current.on("user-offline", handleUserOffline);

      socket.current.on("reconnect_attempt", (attempt) => {
        console.log(`Reconnection attempt ${attempt}`);
      });

      socket.current.on("reconnect_failed", () => {
        console.error("Reconnection failed");
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      initializeSocket();
    } else {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [isAuthenticated]);

  const signup = async (user) => {
    try {
      setLoading(true);
      const res = await registerRequest(user);
      if (res.status === 200) {
        showSuccess('Signup Successful', 'Welcome aboard!');
        setUser(res.data);
        localStorage.setItem(ME_LOCALHOST_KEY, JSON.stringify(res.data));
        localStorage.setItem("token", res.data.token); 
        setIsAuthenticated(true);
        setIsRegistrationComplete(false);
        setVerified(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showError('Oh no!', error.response.data.message);
      console.log(error.response.data);
      setErrors(error.response.data.message);
      throw new Error(error.response.data.message); 
    }
  };

  const bulkVerified = async (values) => {
    try {
      const response = await bulkVerifiedRequest(values);
      showSuccess('Verification Complete', 'All students have been successfully verified.');
    } catch (error) {
      showError('Oh no!', error.response.data.message);
      setErrors(error.response.data.message);
      throw new Error(error.response.data.message); 
    }
  }

  const verifiedId = async (id) => {
    try {
      const response = await verifiedRequest(id);
      getAllAdmins();
      showSuccess("Verification Status", response.data.message);
    } catch (error) {
      showError('Oh no!', error.response.data.message);
      setErrors(error.response.data.message);
      throw new Error(error.response.data.message); 
    }
  }
  const completUser = async (values) => {
    try {
      const response = await completUserRequest(values, user._id);
      showSuccess('Profile Completed', 'Your information has been successfully updated. Welcome!');
      setIsRegistrationComplete(response.data.isRegistrationComplete);
    } catch (error) {
      showError('Oh no!', error.response.data.message);
      setErrors(error.response.data.message);
      throw new Error(error.response.data.message); 
    }
  }

  const editUserProfile = async (user, id) => {
    try {
      const response = await editUserProfileRequest(user, id);
      getAllAdmins();
      showSuccess('Profile Completed', 'Your information has been successfully updated. Welcome!');
    } catch (error) {
      showError('Oh no!', error.response.data.message);
      setErrors(error.response.data.message);
      throw new Error(error.response.data.message); 
    }
  }

  const createOpportunities = useCallback(async (opportunitiesData) => {
    try {
      const response = await createOpportunitiesRequest(opportunitiesData);
      getOpportunities();
      showSuccess('Created!', response.data.message);
      return response.opportunities;
    } catch (error) {
      showError('Oh no!', error.response.data.message);
      setErrors(error.response.data.message);
      throw new Error(error.response.data.message); 
    }
  }, []);

  const deleteOpportunities = async (id) => {
    try {
      console.log(id)
      const response = await deleteOpportunitiesRequest(id);
      getOpportunities();
      showSuccess('Deleted Completed', response.data.message);
    } catch (error) {
      showError('Oh no!', error.response.data.message);
      setErrors(error.response.data.message);
      throw new Error(error.response.data.message); 
    }
  }

  const getOpportunities = async () => {
    try {
      const res = await getOpportunitiesRequest();
      const newItems = res.data;
      setOpportunities(newItems.opportunities); 
    } catch (error) {
      showError('Oh no!', error.response.data.message);
      setErrors(error.response.data.message);
      throw new Error(error.response.data.message); 
    }
  };

  // Create a new assignment
  const createAssignment = useCallback(async (assignmentData) => {
    try {
      const response = await createAssignmentRequest(assignmentData);
      showSuccess('Created!', response.data.message);
      fetchAssignmentById(user._id);
      setCurrentAssignment([]);
      return response.assignment;
    } catch (error) {
      showError('Oh no!', error.response.data.message);
      setErrors(error.response.data.message);
      throw new Error(error.response.data.message); 
    }
  }, []);

  // Update an existing assignment
  const updateAssignment = useCallback(async (assignmentId, updateData) => {
    setLoading(true);
    setErrors(null);
    try {
      const response = await updateAssignmentRequest(assignmentId, updateData);
      setAssignments(prev => 
        prev.map(assignment => 
          assignment._id === assignmentId ? response.assignment : assignment
        )
      );
      return response.assignment;
    } catch (err) {
      setErrors(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAssignment = async (id) => {
    try {
      const response = await deleteAssignmentRequest(id);
      fetchAssignmentById(user._id);
      setCurrentAssignment([])
      showSuccess('Deleted Completed', response.data.message);
    } catch (error) {
      showError('Oh no!', error.response.data.message);
      setErrors(error.response.data.message);
      throw new Error(error.response.data.message); 
    }
  }

  // Get a single assignment by ID
  const fetchAssignmentById = useCallback(async (assignmentId) => {
    try {
      const response = await getAssignmentByIdRequest(assignmentId);
      setCurrentAssignment(response.data);
      console.log(response.data)
      return response.data.assignments;
    } catch (error) {
      showError('Oh no!', error.response.data.message);
      setErrors(error.response.data.message);
      throw new Error(error.response.data.message); 
    }
  }, []);
  
  // Get a single assignment by ID
  const fetchAssignmentByCourse = useCallback(async (assignmentId) => {
    try {
      const response = await getAssignmentByCourseRequest(assignmentId);
      setCurrentAssignment(response.data);
      console.log(response.data)
      return response.data.assignments;
    } catch (error) {
      showError('Oh no!', error.response.data.message);
      setErrors(error.response.data.message);
      throw new Error(error.response.data.message); 
    }
  }, []);

  // Create a new assignment
  const createContest = useCallback(async (contestData) => {
    try {
      const response = await createContestRequest(contestData);
      getContest();
      showSuccess('Create Completed', response.data.message);
      return response.contest;
    } catch (error) {
      showError('Oh no!', error.response.data.message);
      setErrors(error.response.data.message);
      throw new Error(error.response.data.message); 
    }
  }, []);

  const deleteContest = async (id) => {
    try {
      const response = await deleteContestRequest(id);
      getContest();
      showSuccess('Deletion Completed', response.data.message);
    } catch (error) {
      showError('Oh no!', error.response.data.message);
      setErrors(error.response.data.message);
      throw new Error(error.response.data.message); 
    }
  }

  // Get a single assignment by ID
  const getContest = useCallback(async () => {
    try {
      const response = await getContestRequest();
      setContests(response.data.contests);
      return response.data;
    } catch (error) {
      showError('Oh no!', error.response.data.message);
      setErrors(error.response.data.message);
      throw new Error(error.response.data.message); 
    }
  }, []);
  
  const usersAdmin = async (idcard) => {
    try {
      const res = await usersAdminRequest(idcard);
      const newItems = res.data;
      setUserSearch(newItems);
    } catch (error) {
      showError('Oh no!', error.response.data.message);
      console.log(error.response.data);
      setErrors(error.response.data.message);
      throw new Error(error.response.data.message); 
    }
  };

  const createNewAdmin = async (user) => {
    try {
      const response = await createNewAdminRequest(user);
      getAllAdmins();
      showSuccess('User Created', 'The new user has been created successfully.');
    } catch (error) {
      showError('Oh no!', error.response.data.message);
      console.log(error.response.data);
      setErrors(error.response.data.message);
      throw new Error(error.response.data.message); 
    }
  };

  const signin = async (user) => {
    try {
      setLoading(true);
      const res = await loginRequest(user);
      showSuccess('Login Successful', 'Welcome back!');
      setUser(res.data);
      localStorage.setItem(ME_LOCALHOST_KEY, JSON.stringify(res.data));
      localStorage.setItem("token", res.data.token); 
      setIsAuthenticated(true);
      console.log(res.data);
      setIsRegistrationComplete(res.data.isRegistrationComplete);
      setVerified(res.data.verified);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showError('Oh no!', error.response.data.message);
      console.log("Error during login:", error);
      setErrors(error.response.data.message);
      throw new Error(error.response.data.message); 
    }
  };

  const getAllAdmins = async () => {
    try {
      const res = await allAdminsRequest();
      const newItems = res.data;
      setAllAdmins(newItems.data); 
    } catch (error) {
      showError('Oh no!', error.response.data.message);
      setErrors(error.response.data.message);
      throw new Error(error.response.data.message); 
    }
  };

  const getAllTeachers = async () => {
    try {
      const res = await allTeachersRequest();
      const newItems = res.data;
      setAllTeachers(newItems.data); 
    } catch (error) {
      showError('Oh no!', error.response.data.message);
      setErrors(error.response.data.message);
      throw new Error(error.response.data.message); 
    }
  };
  
  const changePassword = async (values) => {
    try {
      const res = await changePasswordRequest(values);
      showSuccess('Password Changed', 'Your password has been successfully updated.');
      return res.data;
    } catch (error) {
      showError('Oh no!', error.response.data.message);
      setErrors(error.response.data.message);
      throw new Error(error.response.data.message); 
    }
  };

  const logout = () => {
    setLoading(true);
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
    showSuccess('Logout', 'Logout successful. See you soon!');
  };

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token"); 
      if (!token) {
        setIsAuthenticated(false);
        setIsRegistrationComplete(false);
        setLoading(false);
        return;
      }

      try {
        const res = await verifyTokenRequest(token);
        if (!res.data) return setIsAuthenticated(false);
        setIsAuthenticated(true);
        setIsRegistrationComplete(res.data.isRegistrationComplete);
        setVerified(res.data.verified);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        showError('Oh no!', error.response.data.message);
        console.log("Error verifying token:", error);
        setIsAuthenticated(false);
        setIsRegistrationComplete(false);
        setVerified(false);
        localStorage.clear();
        setUser(null);
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        signin,
        logout,
        isAuthenticated,
        errors,
        loading,
        createNewAdmin,
        usersAdmin,
        getAllAdmins,
        changePassword,
        allAdmins,
        completUser,
        isRegistrationComplete,
        verified,
        bulkVerified,
        verifiedId,
        editUserProfile,
        allTeachers,
        getAllTeachers,
        createAssignment,
        updateAssignment,
        deleteAssignment,
        fetchAssignmentById,
        currentAssignment,
        createContest,
        deleteContest,
        getContest,
        contests,
        assignments,
        deleteOpportunities,
        opportunities,
        getOpportunities,
        createOpportunities,
        fetchAssignmentByCourse,
        onlineUsers,
        socket
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;