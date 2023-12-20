/* eslint-disable react/prop-types */
/* eslint-disable no-unsafe-optional-chaining */
import { CDN_URL } from "../Utils/constants";
import { Link } from "react-router-dom";

const ResCard = (props) => {
	const { resData } = props;

	// Optional chaining
	const { cloudinaryImageId, name, avgRating, cuisines, costForTwo } =
		resData?.info;

	return (
		<div className="m-4 p-4 w-[300px] rounded-md bg-blue-200">
			<img
				className="rounded-md mb-4"
				src={CDN_URL + cloudinaryImageId}
				alt="Food Image"
			/>

			<div className="text-center">
				<Link to={"/restaurants/" + resData.info.id} key={resData.info.id}>
					<h2 className="font-bold py-2 text-lg"> {name} </h2>
					<button className="p-2 rounded-lg text-white bg-green-500 mb-4">{costForTwo}</button>
				</Link>

				<h3 className="text-green-700 font-bold"> {avgRating} stars</h3>
				<h4 className="mb-4"> {cuisines.join(", ")}</h4>

			</div>
		</div>
	);
};

export default ResCard;