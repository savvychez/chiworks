// ResourceInstance.jsx
import React from "react";
import { Form, useLoaderData } from "react-router-dom";

import axios from "axios";
import config from "../lib/config";
import InstanceScroller from "../components/InstanceScroller";
import InstanceInfo from "../components/InstanceInfo";

export async function loader({ params }) {
  const resource_id = params.id;
  const resource_ctr = await axios.get(
    config.api_url + "/resources/" + resource_id
  );
  const resource = resource_ctr.data;
  console.log(resource);

  resource.job_instance_scroller_data = {
    type: "Jobs",
    itemFor: "resource",
    items: resource.related_jobs,
  };

  resource.employer_instance_scroller_data = {
    type: "Employers",
    itemFor: "resource",
    items: resource.related_employers,
  };

  return { resource };
}

const ResourceInstance = ({ title, data, renderCard }) => {
  const { resource } = useLoaderData();
  return (
    <div className="px-4 md:px-28 pt-12 md:pt-16 bg-slate-50 min-h-screen min-w-screen">
      <InstanceInfo
        heading={resource.name}
        subheading={`${resource.instructor}`}
        image={resource.image_url}
      />
      <div className="data_view flex flex-wrap flex-col text-xl my-5 text-gray-600">
        <ul>
          <li className="py-2">
            <strong>Skills Taught:</strong> {resource.skills_taught}
          </li>
          <li className="py-2">
            <strong>Price:</strong> {resource.price}
          </li>
          <li className="py-2">
            <strong>Dialect:</strong> {resource.locale}
          </li>
          <li className="py-2">"{resource.headline} ..."</li>
        </ul>
      </div>
      <a
        className="block rounded-md py-4 bg-slate-600 text-center my-8 text-white transition-colors duration-75 hover:bg-slate-800 cursor-pointer"
        href={`https://www.udemy.com${resource.course_url}`}
      >
        <strong>Sign Up for the Course on Udemy!</strong>
      </a>
      <InstanceScroller instance={resource.job_instance_scroller_data} />
      <InstanceScroller instance={resource.employer_instance_scroller_data} />
    </div>
  );
};

export default ResourceInstance;
