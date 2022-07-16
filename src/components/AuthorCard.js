import React from "react"
import { Link } from "react-router-dom"
import { format, fromUnixTime } from "date-fns"

import "./AuthorCard.scss"

function AuthorCard({ data }) {
	const getDate = () => {
		const createdAt = fromUnixTime(data.createdAt / 1000)

		return format(createdAt, "MMMM d',' yyyy")
	}

	return (
		<Link to={`/profile/${data.id}`} className="authorcard">
			<div className="authorcard_overlay" />
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
				<div className="acinfo_box">
					<span className="acinfo_box_title">Written News:</span>
					<span className="acinfo_box_data">{data.writtenNews + " "}</span>
				</div>
				<div className="acinfo_box">
					<span className="acinfo_box_title">Followers:</span>
					<span className="acinfo_box_data">{data.followers}</span>
				</div>
				<div className="acinfo_box">
					<span className="acinfo_box_title">Joined:</span>
					<span className="acinfo_box_data">{getDate()}</span>
				</div>
			</div>
		</Link>
	)
}

export default AuthorCard
