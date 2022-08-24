import React, { useEffect } from "react"
import { AiOutlineRocket } from "react-icons/ai"
import { MdOutlineNewReleases } from "react-icons/md"
import { Link } from "react-router-dom"

import "./HomeSort.scss"

function HomeSort({ page, sortBy, setSortBy }) {
	const options = [
		{
			id: "score",
			text: "Best",
			Icon: AiOutlineRocket,
		},
		{
			id: "date",
			text: "New",
			Icon: MdOutlineNewReleases,
		},
	]

	useEffect(() => {
		const buttonToTurnOff = document.querySelector(".homesort_item_active")
		if (buttonToTurnOff) {
			buttonToTurnOff.classList.remove("homesort_item_active")
		}

		const button = document.getElementById(sortBy)
		if (button) button.classList.add("homesort_item_active")
	})

	return (
		<div className="homesort">
			{options.map(({ id, text, Icon }) => (
				<Link
					onClick={() => setSortBy(id)}
					to={`${page}${text.toLowerCase()}`}
					replace
					key={id}
					id={id}
					className="homesort_item"
				>
					<Icon className="homesort_item_icon" />
					{text}
				</Link>
			))}
		</div>
	)
}

export default HomeSort
