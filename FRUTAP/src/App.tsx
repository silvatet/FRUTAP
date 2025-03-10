import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Entrada from "./Pages/Entrada/Entrada";
import Cracha from "./Pages/Cracha/Cracha";
import Saida from "./Pages/Saida/Saida";
import Final from "./Pages/Final/Final"; // ✅ Importando a tela final

import "./App.css";

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Entrada />
            </motion.div>
          }
        />
        <Route
          path="/cracha"
          element={
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Cracha />
            </motion.div>
          }
        />
        <Route
          path="/saida"
          element={
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Saida />
            </motion.div>
          }
        />
        <Route
          path="/final" // ✅ Adicionando a rota para a tela final
          element={
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Final />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
