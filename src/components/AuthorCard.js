import React from "react"
import { Link } from "react-router-dom"
import { format, fromUnixTime } from "date-fns"

import "./AuthorCard.scss"

function AuthorCard({ data, infoBelow }) {
	const className = infoBelow
		? ["authorcard2", "acinfo2"]
		: ["authorcard", "acinfo"]

	const getDate = () => {
		const createdAt = fromUnixTime(data.createdAt / 1000)

		return format(createdAt, "MMMM d',' yyyy")
	}

	return (
		<Link to={`/profile/${data.id}`} className={className[0]}>
			<div className={`${className[0]}_info`}>
				{data.profilePicture === "default" ? (
					<img src="/default_avatar.png" alt="avatar of user" />
				) : (
					<img src={data.profilePicture} alt="avatar of user" />
				)}
				<div className={`${className[0]}_info_text`}>
					<h3>{data.fullName}</h3>
					<p>{data.email}</p>
				</div>
			</div>
			<div className={className[1]}>
				<div className={`${className[1]}_box`}>
					<span className={`${className[1]}_box_title`}>Written News:</span>
					<span className={`${className[1]}_box_data`}>
						{data.writtenNews + " "}
					</span>
				</div>
				<div className={`${className[1]}_box`}>
					<span className={`${className[1]}_box_title`}>Followers:</span>
					<span className={`${className[1]}_box_data`}>{data.followers}</span>
				</div>
				<div className={`${className[1]}_box`}>
					<span className={`${className[1]}_box_title`}>Joined:</span>
					<span className={`${className[1]}_box_data`}>{getDate()}</span>
				</div>
			</div>
		</Link>
	)
}

export default AuthorCard
