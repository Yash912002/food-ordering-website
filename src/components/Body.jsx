import { useContext, useEffect, useState } from "react";
import ResCard, { PromotedLabel } from "./Rescard";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import UserInfo from "../Utils/userContext";

const Body = () => {
	const [Res, setRes] = useState([]);
	const [filterRes, setFilterRes] = useState([]);
	const [searchText, setSearchText] = useState("");
	const {loggedInUser, setName} = useContext(UserInfo)

	// We are passing list of restaurants to promotedLabel which will
	// add the promoted restaurants in "PromotedRestaurants"
	const PromotedRestaurants = PromotedLabel(ResCard);

	// console.log("List of restaurants = ", Res);

	useEffect(() => {
		fetchData();
	}, []);

	function changeUser(e) {
		setName(e.target.value);
	}

	const fetchData = async () => {
		const data = await fetch(
			"https://www.swiggy.com/dapi/restaurants/list/v5?lat=18.621055599465002&lng=73.8306423049214&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING"
		);

		const jsonData = await data.json();
		// console.log(jsonData);

		// Optional chaining
		// const RestaurantData = jsonData?.data?.cards[2]?.card?.card?.gridElements?.infoWithStyle?.restaurants;

		let RestaurantData;

		for (let i = 0; i < jsonData?.data?.cards.length; i++) {
			const card = jsonData?.data?.cards[i];
			// Check if the sequence exists in the current card
			if (
				card?.card?.card?.gridElements?.infoWithStyle?.restaurants !== undefined
			) {
				// If the sequence is found, assign the data and break the loop
				RestaurantData =
					card?.card?.card?.gridElements?.infoWithStyle?.restaurants;
				break;
			}
		}
		setRes(RestaurantData);
		setFilterRes(RestaurantData);
	};

	// Conditional rendering
	return Res.length === 0 ? (
		<Shimmer />
	) : (
		<>
			<div className="body">
				{/* Search bar */}
				<div className="flex">
					<input
						type="search"
						className="border border-solid border-black pl-2 pr-2 ml-9 mb-6 rounded-sm mr-4"
						value={searchText}
						onChange={(e) => {
							// Filter the restaurant cards and update the ui
							setSearchText(e.target.value);
						}}
					/>

					{/* Search button */}
					<button
						className="px-3 py-1 bg-blue-400 rounded-sm text-white mb-6 mr-4 "
						onClick={() => {
							const filterRes = Res.filter((r) => {
								return r.info.name
									.toLowerCase()
									.includes(searchText.toLowerCase());
							});
							setFilterRes(filterRes);
						}}
					>
						Search
					</button>

					{/* Top Rated Restaurant button  */}
					<button
						className="px-5 py-1 bg-orange-500 rounded-sm text-white mb-6 ml-4 mr-4"
						onClick={() => {
							const filteredRes = Res.filter((restaurant) => {
								return restaurant.info.avgRating > 4;
							});
							// setRes(filteredRes);
							setFilterRes(filteredRes);
						}}
					>
						Top Rated Restaurants
					</button>

					<div>
						<label htmlFor=""> User Name </label>
						<input
							type="text"
							className="border border-black"
							value={loggedInUser}
							onChange={changeUser}
						/>
					</div>
				</div>

				{/* Restaurant Card and Info */}
				{/* If the restaurant is promoted then add the "Promoted" label to
					it by using ( Higher Order Components )  */}
				<div className="flex flex-wrap justify-evenly">
					{filterRes.map((restaurant) => (
						<Link
							to={"/restaurants/" + restaurant.info.id}
							key={restaurant.info.id}
						>
							{/* {console.log("Hello",restaurant.info.id)} */}
							{restaurant.info.promoted ? (
								<PromotedRestaurants resData={restaurant} />
							) : (
								<ResCard resData={restaurant} key={restaurant.info.id} />
							)}
						</Link>
					))}
				</div>
			</div>
		</>
	);
};

export default Body;
