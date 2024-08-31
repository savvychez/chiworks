import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "../../components/ui/card"
import { Link } from "react-router-dom";
  

const ResourceCard = ({data}) => {
    return (
        <Link to={`/resources/${data.id}`} className=''>
            <Card className='mr-2 mb-4 w-full max-w-96 h-[450px] cursor-pointer hover:outline outline-2  outline-offset-2 outline-blue-600 '>
                <CardHeader className="flex items-center justify-center">
                    <img src={data.image} alt="" width={400} className='w-full object-cover h-40 rounded-sm' />
                </CardHeader>
                <CardContent className="pb-4">
                    <CardTitle>{data.name}</CardTitle>
                    <CardDescription className="mt-1">{data.location}</CardDescription>
                </CardContent>
                <CardFooter>
                    <ul>
                        <li><strong>Skillsets Taught:</strong> {data.skillsets}</li>
                        <li><strong>Modality:</strong> {data.modality}</li>
                        <li><strong>Cost:</strong> {data.cost}</li>
                    </ul>
                </CardFooter>
            </Card>
        </Link>
    );
}

export default ResourceCard;