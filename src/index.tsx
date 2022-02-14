import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ConnectionProvider from "./contexts/connection";
import ContractProvider from "./contexts/contract";

ReactDOM.render(
  <ConnectionProvider>
    <ContractProvider>
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    </ContractProvider>
  </ConnectionProvider>,
  document.getElementById("root")
);
