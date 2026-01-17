import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import ScrollToTop from './components/ScrollToTop';



function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* 首页路径 */}
        <Route path="/" element={<Home />} />
        
        {/* 动态项目详情页路径，:id 代表后面可以是任意名字 */}
        <Route path="/projects/:id" element={<ProjectDetail />} />

        {/* 关于我们 */}
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
