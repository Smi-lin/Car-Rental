
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { CarHiveContextProvider } from "./context/carHiveContext";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>

    {/* <Theme appearance="dark"> */}
      <CarHiveContextProvider>
        <App />
      </CarHiveContextProvider>
    {/* </Theme> */}

  </React.StrictMode>
);
