import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/LoginPage";
import App from "./pages/App";
import MainApp from "./App";


function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
       {/* <Route path="/about" element={<About />} /> */}
      <Route path="/dashboard" element={<MainApp />} />
    </Routes>
  );
}

export default App;