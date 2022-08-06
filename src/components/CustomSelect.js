import React, { useState } from "react"

import "./CustomSelect.scss"

function CustomSelect({ defaultItem, list, setSelectedItem }) {
	const [selected, setSelected] = useState({
		id: defaultItem.id,
		text: defaultItem.text,
	})
	const [showList, setShowList] = useState(false)

	const handleSelect = (e, id, text) => {
		setSelected({ id, text })
		setSelectedItem({ id, text })
		setShowList(false)
	}

	return (
		<div className="select">
			<button
				onClick={() => setShowList(value => !value)}
				className="select_list_item select_list_selected"
			>
				<span className="select_list_selected_text">
					Sort by: {selected.text}
				</span>
			</button>
			{showList && (
				<div className="select_list">
					{list.map(({ id, text }) => (
						<button
							onClick={e => handleSelect(e, id, text)}
							className="select_list_item"
							key={id}
						>
							{text}
						</button>
					))}
				</div>
			)}
		</div>
	)
}

export default CustomSelect
