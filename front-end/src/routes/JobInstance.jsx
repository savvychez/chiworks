// JobInstance.jsx
import React from "react";
import { Form, useLoaderData } from "react-router-dom";

import axios from 'axios';
import config from '../lib/config';
import InstanceScroller from "../components/InstanceScroller";
import InstanceInfo from "../components/InstanceInfo";
import InstanceCard from "../components/InstanceCard";
import SalaryRange from "../components/SalaryRange";

export async function loader({ params }) {
  const job_id = params.id;
  const job_ctr = await axios.get(config.api_url + '/jobs/' + job_id);
  const job = job_ctr.data;
  console.log(job)

  // job.employer_instance_scroller_data = {
  //   type: "jobs",
  //   itemFor: "jobs",
  //   items: employer.jobs,
  // }

  job.resource_instance_scroller_data = {
    type: "Resources",
    itemFor: "job",
    items: job.resources
  }
  // const employer = employers.items.find(item => item.id == params.id);
  // const related_jobs = jobs.items.filter(item => employer.job_ids.includes(item.id));
  // const related_resources = resources.items.filter(item => employer.resource_ids.includes(item.id));

  // employer.related_jobs = related_jobs;
  // employer.related_resources = related_resources;

  return { job }
}


const JobInstance = ({ title, data, renderCard }) => {
  const { job } = useLoaderData();
  return (
    <div className='px-4 md:px-28 pt-12 md:pt-16 bg-slate-50 min-h-screen min-w-screen'>
      <InstanceInfo heading={job.title} subheading={`${job.employer.title}`} image={job.image_url} />
      <div className='data_view flex flex-wrap flex-col text-xl my-5 text-gray-600'>
        <ul>
          <li className="py-2"><strong>Last Updated:</strong> {job.last_updated}</li>
          <li className="py-2"><strong>Salary:</strong> {job.salary}</li>
          <li className="py-2"><strong>Skills:</strong> {job.skillset}</li>
          <li className="py-2">"{job.description} ..."</li>
        </ul>
      </div>
      <li className="py-4">
        <a
          href={`https://${job.posting_url}`}
          className="my-4 text-cyan-600 underline hover:no-underline cursor-pointer"
          target="_blank"
        >
          <strong>Apply for the job!</strong>
        </a>
      </li>
      <SalaryRange salary={job.salary}/>
      {/* <iframe
        src={job.posting_url}
        sandbox="allow-same-origin"
        className="bg-slate-100 max-w-full"
        width="1000"
        height="450"
        allowfullscreen=""
        loading="lazy"
      ></iframe> */}
      <div>
        <hr className='mt-3 mb-5' />
        <div className=" items-center">
          <h2 className="text-2xl mb-4 text-gray-500 float-left">Employer for this job</h2>
        </div>
        <div className="pb-4 flex flex-no-wrap justify-start w-full h-[520px] overflow-x-auto">
          <div className="w-full mt-2 flex-none md:mr-2 md:w-96 pl-2">
            <InstanceCard data={job.employer} className="pl-4 pb-0 " />
          </div>
        </div>
      </div>
      <InstanceScroller instance={job.resource_instance_scroller_data} />
    </div>
  );
}

export default JobInstance;

