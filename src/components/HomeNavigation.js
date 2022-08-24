import React, { useEffect } from "react"
import { Link } from "react-router-dom"

import "./HomeSort.scss"

function HomeNavigation({ page, setPage }) {
	const options = [
		{
			id: "/",
			text: "Home",
		},
		{
			id: "/followed/",
			text: "Followed",
		},
		{
			id: "/r/romania/",
			text: "r/Romania",
		},
	]

	useEffect(() => {
		const buttonToTurnOff = document.querySelector(".homesort_item_active2")
		if (buttonToTurnOff) {
			buttonToTurnOff.classList.remove("homesort_item_active2")
		}

		const button = document.getElementById(page)
		button.classList.add("homesort_item_active2")
	})

	return (
		<div className="homesort">
			{options.map(({ id, text }) => (
				<Link
					onClick={() => setPage(id)}
					to={id}
					replace
					key={id}
					id={id}
					className="homesort_item"
				>
					{text}
				</Link>
			))}
		</div>
	)
}

export default HomeNavigation
