import React from "react"

function BaseCard({ thumbnailIndex, title, list, children }) {
	return (
		<div className="card">
			<div
				className="card_thumbnail"
				style={{ backgroundImage: `url(/card_thumbnail${thumbnailIndex}.jpg)` }}
			>
				<div className="card_thumbnail_overlay"></div>
				<span className="card_thumbnail_title">{title}</span>
			</div>
			<div className="card_container" style={{ padding: list ? "0" : "20px" }}>
				{children}
			</div>
		</div>
	)
}

export default BaseCard
