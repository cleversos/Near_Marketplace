import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import CollectionProvider from "./contexts/collections"
import ConnectionProvider from "./contexts/connection"
import ContractProvider from "./contexts/contract"

ReactDOM.render(
  <ConnectionProvider>
    <ContractProvider>
      <CollectionProvider>
        <React.StrictMode>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </React.StrictMode>
      </CollectionProvider>
    </ContractProvider>
  </ConnectionProvider>,
  document.getElementById("root")
)
