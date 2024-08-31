// instance:
// instance = {
//     type: string,
//     itemFor: string,
//     items: [
//         InstanceCard_data object
//     ]
import React from "react"
import InstanceCard from "./InstanceCard"
const InstanceScroller = ({ instance }) => {
    return (
        <div>
            <hr className='mt-3 mb-5'/>
            <div className=" items-center">
              <h2 className="text-2xl text-gray-500 float-left">{instance.type} for this {instance.itemFor}</h2>
              <h2 className="float-right text-gray-400 mb-6">{instance.items.length} found</h2>
            </div>
            <div className="pb-4 pl-2 flex flex-no-wrap justify-start w-full h-[580px] overflow-x-auto">
                {
                    instance.items.map((instance_data, index) => {
                        return (
                            <div key={index} className="w-full mt-2 flex-none md:mr-2 md:w-96">
                                <InstanceCard key={index} data={instance_data} className="ml-4"/>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default InstanceScroller;
