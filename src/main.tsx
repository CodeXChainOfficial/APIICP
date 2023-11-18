import React from "react";
import ReactDOM from "react-dom/client";
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import "./index.css";
import App from "./App";
import Error from "./pages/error";
import Home from "./pages/home";
import CreateTokenICP from "./pages/TokenGen/pages/erc20Standard";
import { AppRoutes } from "./shared/constants";
// @ts-ignore
import ERC20Standard from "./pages/TokenGen/pages/erc20Standard/ERC20Standard.jsx";
// @ts-ignore
import ERC20Advance from "./pages/TokenGen/pages/erc20Standard/ERC20Advance.jsx";
// @ts-ignore
import ERC20Drop from "./pages/TokenGen/pages/erc20Standard/ERC20Drop.jsx";
// @ts-ignore
import ERC20Dropvote from "./pages/TokenGen/pages/erc20Standard/ERC20Dropvote.jsx";
// @ts-ignore
import ERC20SignatureMint from "./pages/TokenGen/pages/erc20Standard/ERC20SignatureMint.jsx";
// @ts-ignore
import ERC20Vote from "./pages/TokenGen/pages/erc20Standard/ERC20Vote";
// @ts-ignore
import ERC20SignatureMintVote from "./pages/TokenGen/pages/erc20Standard/ERC20SignatureMintVote.jsx";
// @ts-ignore
import ERC20Staking from "./pages/TokenGen/pages/erc20Standard/ERC20Staking";
import DIP20 from "./pages/TokenGen/pages/ICP_Master/DIP20Standard";

// @ts-ignore
import { ComponentType } from 'react';






const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<Error />}>
      <Route errorElement={<Error />}>
        <Route index element={<DIP20 />} />

        <Route path={AppRoutes.icp + "/*"} element={<CreateTokenICP />} />
   
        <Route path={AppRoutes.ERC20Standard + "/*"} element={<ERC20Standard />} />
        <Route path={AppRoutes.ERC20Advance + "/*"} element={<ERC20Advance />} />
        <Route path={AppRoutes.ERC20Drop + "/*"} element={<ERC20Drop />} />
        <Route path={AppRoutes.ERC20Dropvote + "/*"} element={<ERC20Dropvote />} />
        <Route path={AppRoutes.ERC20SignatureMint + "/*"} element={<ERC20SignatureMint />} />
        <Route path={AppRoutes.ERC20SignatureMintVote + "/*"} element={<ERC20SignatureMintVote />} />
        <Route path={AppRoutes.ERC20Vote + "/*"} element={<ERC20Vote />} />
        <Route path={AppRoutes.ERC20Staking + "/*"} element={<ERC20Staking />} />

      

        {/* <Route path="launchpad/*" element={<Launchpad />}>
          <Route index element={<CreateLaunchpad />} />
          <Route path="result" element={<LaunchpadResult />} />
          <Route path="*" element={<CreateLaunchpad />} />
        </Route> */}
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// Array version ---> for reference and comparison ---> See element version below.

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     errorElement: <Error />,
//     children: [
//       {
//         errorElement: <Error />,
//         children: [
//           { index: true, element: <Home /> },
//           {
//             path: "launchpad",
//             element: <Launchpad />,
//             children: [
//               { index: true, element: <LaunchpadForm /> },
//               { path: "result", element: <LaunchpadResult /> },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// ]);

// Element version ---> for reference and comparison

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path="/" element={<App />} errorElement={<Error />}>
//       <Route errorElement={<Error />}>
//         <Route index element={<Home />} />

//         <Route path="launchpad" element={<Launchpad />}>
//           <Route index element={<LaunchpadForm />} />
//           <Route path="result" element={<LaunchpadResult />} />
//         </Route>
//       </Route>
//     </Route>
//   )
// );
