import React, { useState } from "react"
import { AiOutlineDown } from "react-icons/ai"
import { Link } from "react-router-dom"

import "./AccordionMenu.scss"

function AccordionMenu({ title, baseUrl, items }) {
	const [collapsed, setCollapsed] = useState(true)

	const toggleCollapsed = () => {
		const div = document.getElementById(title)

		div.style.transform = `rotate(${!collapsed ? "-90deg" : "0"})`

		setCollapsed(value => !value)
	}

	return (
		<div className="accordion">
			<div onClick={toggleCollapsed} className="accordion_title">
				<span>{title}</span>
				<AiOutlineDown id={title} className="accordion_title_icon" />
			</div>
			{!collapsed && (
				<div className="accordion_menu">
					{items.map(({ id, text, Icon }) => (
						<Link
							key={id}
							to={`${baseUrl}/${id}`}
							target="_top"
							className="accordion_menu_item"
						>
							{Icon && <Icon className="accordion_menu_item_icon" />}
							{text}
						</Link>
					))}
				</div>
			)}
		</div>
	)
}

export default AccordionMenu
