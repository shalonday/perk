import { BrowserRouter, Routes, Route } from "react-router-dom";
import Search from "./pages/Search";
import Tree from "./pages/Tree";
import PageNotFound from "./pages/PageNotFound";
import Edit from "./pages/Edit";
import "./App.css";
import { SkillTreesContextProvider } from "./contexts/SkillTreesContext";

function App() {
  return (
    <SkillTreesContextProvider>
      <BrowserRouter basename="/perk">
        <Routes>
          <Route index element={<Search />} />
          <Route path="s/:startNodeId/e/:endNodeId" element={<Tree />} />
          <Route path="edit/" element={<Edit />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </SkillTreesContextProvider>
  );
}

export default App;
