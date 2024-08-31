import { Link } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "../../components/ui/card"
  

const EmployerCard = ({data}) => {
    return (
        <Link to={`/employers/${data.id}`} className=''>
            <Card className='mr-2 mb-4 w-full max-w-96 h-[350px] cursor-pointer hover:outline outline-2  outline-offset-2 outline-blue-600 '>
                <CardHeader className="flex items-center justify-center pt-12">
                    <img src={data.image} alt="" height="20px" className='h-20' />      
                </CardHeader>
                <CardContent className="pb-4">
                    <CardTitle>{data.name}</CardTitle>
                    <CardDescription className="mt-1">{data.location}</CardDescription>
                </CardContent>
                <CardFooter>
                    <ul>
                        <li><strong>Glassdoor Rating:</strong> {data.review}</li>
                        <li><strong>Industry:</strong> {data.industry}</li>
                        <li><strong>Size:</strong> {data.size}</li>
                    </ul>
                </CardFooter>
            </Card>
        </Link>
    );
}

export default EmployerCard;