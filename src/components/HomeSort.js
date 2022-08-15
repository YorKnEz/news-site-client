import React, { useEffect } from "react"
import { AiOutlineReddit, AiOutlineRocket } from "react-icons/ai"
import { MdOutlineNewReleases } from "react-icons/md"
import { Link } from "react-router-dom"

import "./HomeSort.scss"

function HomeSort({ sortBy }) {
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
		{
			id: "reddit",
			text: "r/Romania",
			Icon: AiOutlineReddit,
		},
	]

	useEffect(() => {
		const buttonToTurnOff = document.querySelector(".homesort_item_active")
		if (buttonToTurnOff)
			buttonToTurnOff.classList.remove("homesort_item_active")

		const button = document.getElementById(sortBy)
		button.classList.add("homesort_item_active")
	})

	return (
		<div className="homesort">
			{options.map(({ id, text, Icon }) => (
				<Link
					to={`/${text.toLowerCase()}`}
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
