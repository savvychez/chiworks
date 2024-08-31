import { Form, useLoaderData } from "react-router-dom";
import React from "react";
import axios from "axios";
import config from "../lib/config";
import InstanceScroller from "../components/InstanceScroller";
import InstanceInfo from "../components/InstanceInfo";

export async function loader({ params }) {
  const employer_id = params.id;
  const employer_ctr = await axios.get(
    config.api_url + "/employers/" + employer_id
  );
  const employer = employer_ctr.data;
  console.log(employer);

  employer.job_instance_scroller_data = {
    type: "Jobs",
    itemFor: "employer",
    items: employer.jobs,
  };

  employer.resource_instance_scroller_data = {
    type: "Resources",
    itemFor: "employer",
    items: employer.resources,
  };

  return { employer };
}

const EmployerInstance = ({ title, data, renderCard }) => {
  const { employer } = useLoaderData();
  return (
    <div className="px-4 md:px-28 pt-12 md:pt-16 bg-slate-50 min-h-screen min-w-screen">
      <InstanceInfo
        heading={employer.name}
        subheading={`Based in ${employer.hq_location}`}
        image={employer.image_url}
      />
      <div className="data_view flex flex-wrap flex-col text-xl my-5 text-gray-600">
        <ul>
          <li className="py-2">
            <strong>Company Type:</strong> {employer.company_type}
          </li>
          <li className="py-2">
            <strong>Industry:</strong> {employer.industry}
          </li>
          <li className="py-2">
            <strong>Size:</strong> {employer.size}
          </li>
          <li className="py-2">"{employer.description} ..."</li>
        </ul>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "65vh",
        }}
      >
        <ul>
          <iframe
            src={employer.map_url}
            width="1000"
            height="450"
            className="bg-slate-100 max-w-full"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </ul>
      </div>
      <InstanceScroller instance={employer.job_instance_scroller_data} />
      <InstanceScroller instance={employer.resource_instance_scroller_data} />
    </div>
  );
};

export default EmployerInstance;
