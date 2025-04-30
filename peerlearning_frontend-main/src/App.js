import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import Home from "./components/Home";
import Navbar from "./components/Navbar/Nav";
import Dashboard from "./components/Dashboard";
import Help from "./components/Help/Help";
import Calendar from "./components/Calendar/Calendar";
import Done from "./components/Todo/Done";
import Missing from "./components/Todo/Missing";
import TodoList from "./components/Todo/TodoList";
import Student_View1 from "./components/student_View/Student_View1";
import Page1 from "./components/TeacherDashboard/Page1";
import SkillListings from "./components/Skills/SkillListings";
import Chatbot from "./components/Chatbot/Chatbot";

function App() {
  const [course, setCourse] = useState({});

  return (
    <AuthProvider>
      <div className="body">
        <Router>
          <Navbar setCourse={setCourse} />
          <Chatbot />
          <Routes>
            <Route path="/" element={<Home course={course} setCourse={setCourse} />} />
            <Route path="/Help" element={<Help />} />
            <Route path="/Assigned" element={<TodoList />} />
            <Route path="/Missing" element={<Missing />} />
            <Route path="/Done" element={<Done />} />
            <Route path="/Calendar" element={<Calendar />} />
            <Route path="/Sview1/:AssId/:Cid" element={<Student_View1 />} />
            <Route path="/TeacherView1/:AssId/:Cid" element={<Page1 />} />
            <Route path="/dashboard/:course_id/:id" element={<Dashboard />} />
            <Route path="/skills" element={<SkillListings />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
