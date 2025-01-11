import React, { useState } from 'react';// this portion is removed from the project
import { BookOpen, Plus, Search, Filter, Grid2X2, List, Save, Edit2 } from 'lucide-react';
import AdminNavbar from "@/components/Navbars/AdminNavbar.jsx";

const Card = ({ children, className }) => (
  <div className={`bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-teal-900/50 backdrop-blur-xl rounded-2xl shadow-2xl ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="p-6 border-b border-white/10">
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text">
    {children}
  </h2>
);

const CardContent = ({ children }) => (
  <div className="p-6">
    {children}
  </div>
);

const StudentGradeCard = ({ student, onSaveGrade }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [grade, setGrade] = useState(student.grade);
  const [comments, setComments] = useState(student.comments);

  const handleSave = () => {
    onSaveGrade(student.id, { grade, comments });
    setIsEditing(false);
  };

  return (
    <Card className="w-full">
      <CardContent>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
            <BookOpen size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">{student.name}</h3>
            <div className="mt-1 text-sm text-gray-400">{student.studentId}</div>
            <div className="mt-2 space-y-2">
              {isEditing ? (
                <>
                  <div className="flex gap-4 items-center">
                    <label className="text-gray-400">Grade:</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="bg-gray-900/50 border border-white/10 rounded px-3 py-1 text-white w-24"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-400">Comments:</label>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className="bg-gray-900/50 border border-white/10 rounded px-3 py-2 text-white w-full"
                      rows="3"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="text-gray-400">Grade: <span className="text-white">{grade}/100</span></div>
                  <div className="text-gray-400">Comments: <span className="text-white">{comments}</span></div>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors group"
              >
                <Save size={20} className="text-green-400 group-hover:scale-110 transition-transform" />
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors group"
              >
                <Edit2 size={20} className="text-purple-400 group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const GradeManagement = () => {
  const [students] = useState([
    {
      id: 1,
      name: "Shad Ahmad",
      studentId: "2024-0001",
      grade: "85",
      comments: "Excellent class participation"
    },
    {
      id: 2,
      name: "Mohd Arshad",
      studentId: "2024-0002",
      grade: "78",
      comments: "Needs improvement in assignments"
    },
    {
      id: 3,
      name: "Nausheen Khan",
      studentId: "2024-0003",
      grade: "92",
      comments: "Outstanding in all aspects"
    },
    {
      id: 4,
      name: "Arbaj Alam",
      studentId: "2024-0004",
      grade: "82",
      comments: "Outstanding"
    }
  ]);

  const handleSaveGrade = (studentId, data) => {
    // Here you would implement the logic to save the grade in your backend
    console.log(`Saving grade for student ${studentId}:`, data);
  };

  return (
    <>
      <AdminNavbar nav="Grade Management" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center relative">
          <div className="inline-block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur transform scale-110" />
              <div className="relative bg-black p-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
                <BookOpen size={40} className="text-white" />
              </div>
            </div>
          </div>
          <h1 className="mt-6 text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text">
            Upload Notes
          </h1>
          <p className="mt-2 text-slate-400">
            Manage your students' grades
          </p>
        </div>

        <div className="mb-8 grid grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">32</div>
              <div className="text-gray-400 text-sm">Students</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">85</div>
              <div className="text-gray-400 text-sm">Average</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">95</div>
              <div className="text-gray-400 text-sm">Max Grade</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">70</div>
              <div className="text-gray-400 text-sm">Min Grade</div>
            </div>
          </Card>
        </div>

        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search students..."
              className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-300"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-white/10 rounded-lg hover:bg-gray-800/50">
              <Filter size={20} className="text-gray-400" />
              <span className="text-gray-300">Filter</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-white/10 rounded-lg hover:bg-gray-800/50">
              <Grid2X2 size={20} className="text-gray-400" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-white/10 rounded-lg hover:bg-gray-800/50">
              <List size={20} className="text-gray-400" />
            </button>
          </div>
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg hover:opacity-90 transition-opacity">
              <Plus size={20} className="text-white" />
              <span className="text-white">Add Student</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {students.map((student) => (
            <StudentGradeCard
              key={student.id}
              student={student}
              onSaveGrade={handleSaveGrade}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default GradeManagement;
