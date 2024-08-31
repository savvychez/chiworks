import { Form, useLoaderData } from "react-router-dom";

import axios from 'axios';
import config from '../lib/config';
import InstanceCard from "../components/InstanceCard";

// data format
// 
// 

// loads 
export async function loader({ params }) {
    const instance_id = params.id;
    console.log(params)
    const instance_ctr = await axios.get(config.api_url + '/' + params.route + '/' + instance_id);
    const instance = instance_ctr.data;

    // title
    // subheading
    // img_url
    // related_instances


    return { instance }
}
  

const InstancePage = ({title, data, renderCard}) => {
    const { instance } = useLoaderData();

    return (
        <div className='px-4 md:px-28 pt-12 md:pt-16 bg-slate-50 min-h-screen min-w-screen'>
            <div className="flex items-center justify-between py-10">
                <div>
                    <h1 className='text-xl md:text-5xl w-32 pb-2 font-serif font-bold text-[#3b4354] max-w-3xl'>{instance.title}</h1>
                    <h2 className="pb-4 text-lg text-gray-500">{instance.subheading}</h2>
                </div>
                <img src={instance.image_url} alt="" height="40px" className='h-32 w-32 md:h-40 md:w-40 rounded-md' />
            </div>
            <hr className='mt-0 mb-3'/>
            <div className='data_view flex flex-wrap flex-col text-xl my-5 text-gray-600'>
                <ul>
                    {instance.details.map((detail, index) => (
                        <li key={data.id + "-i-p-detail-" + index} className="py-2"><strong>{detail[0]}:</strong> {detail[1]}</li>
                    ))}
                </ul>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '65vh' }}>
                <ul>
                    <iframe src={employer.map_url} width="1000" height="450" className="bg-slate-100 max-w-full" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>                
                </ul>
            </div>
            <hr className='mt-3 mb-5'/>
            <h2 className="pb-8 text-2xl text-gray-500">Jobs from this employer</h2>
            {
                instance.related_instances.map((instance, index) => {

                })
            }
            <div className="pb-4 flex flex-no-wrap justify-start w-full h-[510px] overflow-x-auto">
                {
                    employer.jobs.map((job, index) => {
                        return (
                            <div key={index} className="w-full mt-2 flex-none ml-2 md:mr-2 md:w-96">
                                <InstanceCard key={index} data={job} className="pr-4"/>
                            </div>
                        )
                    })
                }
            </div>
            <hr className='mt-3 mb-5'/>
            <div className=" w-full space-evenly items-center pb-8">
              <h2 className="text-2xl text-gray-500">Useful resources for this employer</h2>
              <h2 className="float-right">{employer.resources.length} found</h2>
            </div>
            <div className="pb-4 flex flex-no-wrap justify-start w-full h-[580px] overflow-x-auto">
                {
                    employer.resources.map((res, index) => {
                        return (
                            <div key={index} className="w-full mt-2 flex-none ml-2 md:mr-2 md:w-96">
                                <InstanceCard key={index} data={res} className="pr-4"/>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default InstancePage;