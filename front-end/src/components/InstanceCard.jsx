import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "../../components/ui/card"
import {Highlightable} from "./Highlightable";
  

// data format
//     id: int
//     route: str
//     title: str
//     image: str
//     subheading: str
//     details: {[
//         label: str
//         value: str
//     ]}

const InstanceCard = ({data}) => {
    return (
        <Link to={`/${data.route}/${data.id}`} className=''>
            <Card className='mr-2 mb-4 w-full max-w-96 min-h-[490px] cursor-pointer hover:outline outline-2  outline-offset-2 outline-blue-600 '>
                <CardHeader className="flex items-center justify-center">
                    <img src={data.image} alt="" width={400} className='w-full object-cover h-48 rounded-sm' />
                </CardHeader>
                <CardContent className="pb-4">
                    <CardTitle><Highlightable highlight={data.query} matches={data.matches} type={"title"}>{data.title}</Highlightable></CardTitle>
                    <CardDescription className="mt-1"><Highlightable highlight={data.query} matches={data.matches} type={"subheading"}>{data.subheading}</Highlightable></CardDescription>
                </CardContent>
                <CardFooter>
                    <ul>
                        {data.details.map((detail, index) => (
                            <li key={data.id + "-detail-" + index}><strong>{detail[0]}:</strong> <Highlightable highlight={data.query} matches={data.matches} type={"details"}>{detail[1]}</Highlightable></li>
                        ))}
                    </ul>
                </CardFooter>
            </Card>
        </Link>
    );
}

export default InstanceCard;