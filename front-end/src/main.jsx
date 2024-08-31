import React from 'react'
import ReactDOM from 'react-dom/client'
import ErrorPage from './error-page.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import HomePage from './routes/HomePage.jsx';
import Nav from './routes/Nav.jsx';
import About from './routes/About.jsx';
import ModelView from './routes/ModelView.jsx';
import EmployerInstance, {
  loader as employerLoader
} from './routes/EmployerInstance.jsx';
import ResourceInstance, {
  loader as resourceLoader
} from './routes/ResourceInstance.jsx';
import JobInstance, {
  loader as jobLoader
} from './routes/JobInstance.jsx';
import InstancePage, {
  loader as instanceLoader
} from './routes/InstancePage.jsx';
import Search, {
  loader as searchLoader
} from './routes/Search.jsx';
import { getJobs, getEmployers, getResources } from './lib/api.js';
import Visualizations from './routes/Visualizations.jsx';
import ProviderVisualizations from './routes/ProviderVisualizations.jsx';



const router = createBrowserRouter([
  {
    path: "/",
    element: <Nav/>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/employers",
        element: <ModelView 
                    title="Employers" 
                    key="employers"
                    // data={employers.items} 
                    fetchData={getEmployers}
                    // renderCard={(job, index) => <EmployerCard key={index} data={job} />}
                  />,
      },
      {
        path: "/jobs",
        element: <ModelView 
                    title="Jobs"
                    key="jobs" 
                    // data={jobs.items} 
                    fetchData={getJobs}
                    // renderCard={(job, index) => <InstanceCard key={index} />}
                    // renderCard={(job, index) => <JobCard key={index} data={job} />}
                  />,
      },
      {
        path: "/resources",
        element:  <ModelView 
                    title="Resources"
                    key="resources"
                    fetchData={getResources} 
                    // data={resources.items} 
                    // renderCard={(job, index) => <ResourceCard key={index} data={job} />}
                  />,
      },
      {
        path: "/employers/:id",
        loader: employerLoader,
        element: <EmployerInstance />,
      },
      {
        path: "/jobs/:id",
        loader: jobLoader,
        element: <JobInstance />,
      },
      {
        path: "/resources/:id",
        loader: resourceLoader,
        element: <ResourceInstance />,
      },
      {
        path: "/search/:query?",
        loader: searchLoader,
        element: <Search/>,
      },
      {
        path: "/:route/:id",
        loader: instanceLoader,
        element: <InstancePage/>,
      },
      { 
        path: "visualizations", 
        element: <Visualizations /> 
      },
      {
        path: "providervis",
        element: <ProviderVisualizations />,
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}  />
  </React.StrictMode>,
)
