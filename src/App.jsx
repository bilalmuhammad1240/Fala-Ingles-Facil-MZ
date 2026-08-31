import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Module from "./pages/Module";
import Lesson from "./pages/Lesson";
import LessonPlayer from "./pages/LessonPlayer";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<><Nav /><Home /></>} />
      <Route path="/:moduleSlug" element={<><Nav /><Module /></>} />
      <Route path="/:moduleSlug/:lessonSlug" element={<LessonPlayer />} />
      <Route path="/:moduleSlug/:lessonSlug/texto" element={<><Nav /><Lesson /></>} />
    </Routes>
  );
}
