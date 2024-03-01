import "./app.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Button} from "@mmorg/ds-mindmatcher";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import RefineWrapper from "RefineWrapper";
import Store from "Store";
import { getDeployedPathname } from "@mmorg/rdfx-refine";
import { useMemo } from "react";

const App = () => {
  // const httpDir = useMemo(() => getDeployedPathname(window.location), []);
  // const basename = { basename: httpDir };

  return (
    // <BrowserRouter {...basename}>
    <BrowserRouter>
      <MantineProvider theme={{
  colorScheme: 'light',
  colors: {
   
    brand: ['#f0f', '#f0f', '#f0f', '#f0f', '#f0f', '#f0f', '#f0f', '#f0f', '#f0f', '#f0f'],
  },
  fontFamily: 'Votre famille de polices',
  
}}>
        {/* <RefineWrapper> */}
        {/* <Store> */}
        <Notifications position="top-right" />
        <Routes>
          <Route path="/" element={<div> Jobsong App <Button>  Le button est là</Button></div>} />
        </Routes>
      </MantineProvider>
      {/* </Store> */}
      {/* </RefineWrapper> */}
    </BrowserRouter>
  );
};

export default App;
