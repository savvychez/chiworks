import { Link } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "../../components/ui/card"
  

const JobCard = ({data}) => {
    return (
        <Link to={`/jobs/${data.id}`} className=''>
            <Card className='mr-2 mb-4 w-full max-w-96 h-[450px] cursor-pointer hover:outline outline-2  outline-offset-2 outline-blue-600 '>
                <CardHeader className="flex items-center justify-center">
                    <img src={data.image} alt="" width={400} className='w-full object-cover h-40 rounded-sm' />
                </CardHeader>
                <CardContent className="pb-4">
                    <CardTitle>{data.name}</CardTitle>
                    <CardDescription className="mt-1">{data.employer_name}</CardDescription>
                </CardContent>
                <CardFooter>
                    <ul>
                        <li><strong>Skillset:</strong> {data.skillset}</li>
                        <li><strong>Required education:</strong> {data.education}</li>
                        <li><strong>Experience:</strong> {data.experience}</li>
                        <li><strong>Salary:</strong> {data.salary}</li>
                    </ul>
                </CardFooter>
            </Card>
        </Link>
    );
}

export default JobCard;