import React from "react"
import { Link } from "react-router-dom"

import { format, fromUnixTime } from "date-fns"

import "./AuthorCard.scss"

function AuthorCard({ data }) {
	const getDate = () => {
		const createdAt = fromUnixTime(data.createdAt / 1000)

		return format(createdAt, "MMMM d',' yyyy")
	}

	const items = [
		{ title: "Written News", info: data.writtenNews },
		{ title: "Followers", info: data.followers },
		{ title: "Joined", info: getDate() },
	]

	return (
		<Link to={`/profile/${data.id}/overview`} className="authorcard">
			<div className="authorcard_info">
				{data.profilePicture === "default" ? (
					<img src="/default_avatar.png" alt="avatar of user" />
				) : (
					<img src={data.profilePicture} alt="avatar of user" />
				)}
				<div className="authorcard_info_text">
					<h3>{data.fullName}</h3>
					<p>{data.email}</p>
				</div>
			</div>
			<div className="acinfo">
				{items.map(({ title, info }) => (
					<div key={title} className="acinfo_box">
						<span className="acinfo_box_title">{title}:</span>
						<span className="acinfo_box_data">{info}</span>
					</div>
				))}
			</div>
		</Link>
	)
}

export default AuthorCard
