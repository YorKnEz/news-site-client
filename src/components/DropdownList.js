import React, { useState } from "react"
import { AiOutlineMore } from "react-icons/ai"

import "./DropdownList.scss"
import { Button } from "."

function DropdownList({ children, depth }) {
	const [showDropdown, setShowDropdown] = useState(false)

	const shouldShowMore = () => {
		const width = window.innerWidth

		if (depth >= 3) {
			return (width > 768 && width <= 900) || width <= 500
		} else if (depth >= 0) {
			return width <= 420
		}
	}

	const [showMore, setShowMore] = useState(shouldShowMore())

	const toggleDropdown = () => setShowDropdown(value => !value)

	window.addEventListener("resize", e => setShowMore(shouldShowMore()))

	return (
		<div className="dropdownlist">
			{showMore && <Button onClick={toggleDropdown} Icon={AiOutlineMore} />}
			{!showMore && <div className="dropdownlist_items">{children}</div>}
			{showMore && showDropdown && (
				<div className="dropdownlist_items2">{children}</div>
			)}
		</div>
	)
}

export default DropdownList
