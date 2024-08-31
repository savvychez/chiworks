import React from "react";
const InstanceInfo = ({ heading, subheading, image }) => {

    return (
        <div>
            <div className="flex items-center justify-between py-10">
                <div>
                    <h1 className='text-xl md:text-5xl w-42 pb-2 font-serif font-bold text-[#3b4354] max-w-3xl'>{heading}</h1>
                    <h2 className="pb-4 text-lg text-gray-500">{subheading}</h2>
                </div>
                <img src={image} alt="" height="40px" className='h-32 w-32 md:h-40 md:w-40 rounded-md' />
            </div>
            <hr className='mt-0 mb-3'/>
        </div>
    )
};

export default InstanceInfo;