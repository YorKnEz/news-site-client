import React from "react"
import { Link } from "react-router-dom"

import "./AuthorInfo.scss"

function AuthorInfo({ data, type, subreddit, link }) {
	if (type === "reddit") {
		return (
			<div className="author">
				<span>Shared by:</span>
				<div
					className="author_avatar"
					style={{ backgroundImage: `url(${data.profilePicture})` }}
				></div>
				<div className="author_info">
					<span className="author_info_fullname">{data.fullName}</span>
					<span className="author_info_origin">
						From:{" "}
						<div
							style={{ marginLeft: "4px" }}
							className="link"
							href={`https://www.reddit.com/${subreddit}`}
						>
							{subreddit}
						</div>
					</span>
				</div>
			</div>
		)
	}

	const authorBody = (
		<div className="author">
			<span>Written by:</span>
			<div
				className="author_avatar"
				style={{
					backgroundImage: `url(${
						data.profilePicture !== "default"
							? data.profilePicture
							: "../default_avatar.png"
					})`,
				}}
			></div>
			<div className="author_info">
				<span className="author_info_fullname">{data.fullName}</span>
				<span className="author_info_from">
					{/* to add link to the news creation page */}
					Created on <em>YorkNews</em>
				</span>
			</div>
		</div>
	)

	return (
		<>
			{link ? (
				<Link className="author" to={`/profile/${data.id}`}>
					{authorBody}
				</Link>
			) : (
				<div className="author">{authorBody}</div>
			)}
		</>
	)
}

export default AuthorInfo
