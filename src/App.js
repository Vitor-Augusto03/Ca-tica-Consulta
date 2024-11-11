import React from "react";
import RoutesApp from "./routes";
import { ToastContainer } from "react-toastify"; // Importando o ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Importando o CSS do Toastify

const App = () => (
  <>
    <ToastContainer/> 
    <RoutesApp />
  </>
);

export default App;
