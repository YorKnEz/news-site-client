import React, { useState } from "react"
import { AiOutlineMore } from "react-icons/ai"

import "./DropdownList.scss"
import { Button } from "."

function DropdownList({ children }) {
	const [showDropdown, setShowDropdown] = useState(false)
	const [showMore, setShowMore] = useState(window.innerWidth <= "400")

	const toggleDropdown = () => setShowDropdown(value => !value)

	window.addEventListener("resize", e =>
		setShowMore(e.target.innerWidth <= "400")
	)

	return (
		<div className="dropdownlist">
			{showMore && <Button onClick={toggleDropdown} Icon={AiOutlineMore} />}
			{(!showMore || showDropdown) && (
				<div className="dropdownlist_items">{children}</div>
			)}
		</div>
	)
}

export default DropdownList
