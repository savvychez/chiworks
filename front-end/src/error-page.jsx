import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page" className="text-white flex pt-48">
        <div className="m-auto">
            <h1 className="text-lg text-center">oh no! an unexpected error has occurred:</h1>
            <p className="text-5xl my-2 font-bold">{error.statusText || error.message}</p>
        </div>
    </div>
  );
}