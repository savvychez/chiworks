import { Link } from "react-router-dom";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import ReactLoading from "react-loading";

const MemberCard = ({ data, loading }) => {
  return (
    <div>
      <Card className="w-72  my-4 mr-2">
        <CardHeader className="flex items-center justify-center flex-wrap">
          <img
            src={data.image}
            alt=""
            width={400}
            className=" object-cover h-40 w-40 rounded-sm"
          />
        </CardHeader>
        <CardContent className="pb-1">
          <CardTitle>{data.name}</CardTitle>
          <CardDescription className="">{data.responsibility}</CardDescription>
        </CardContent>
        <CardFooter>
          <ul className="">
            <li className="w-full my-2 text-gray-700">{data.bio}</li>
            <li className="flex items-center py-1">
              <strong className="pr-1">Commits:</strong>
              {loading ? (
                <ReactLoading
                  type={"bubbles"}
                  color={"#000000"}
                  height={"20px"}
                  width={"20px"}
                />
              ) : (
                data.commitCount
              )}
            </li>
            <li className="flex items-center py-1">
              <strong className="pr-1">Closed Issues:</strong>
              {loading ? (
                <ReactLoading
                  type={"bubbles"}
                  color={"#000000"}
                  height={"20px"}
                  width={"20px"}
                />
              ) : (
                data.closedIssues
              )}
            </li>
            <li className="flex items-center py-1">
              <strong className="pr-1">Unit Tests:</strong>
              {loading ? (
                <ReactLoading
                  type={"bubbles"}
                  color={"#000000"}
                  height={"20px"}
                  width={"20px"}
                />
              ) : (
                data.unitTests
              )}
            </li>
          </ul>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MemberCard;
