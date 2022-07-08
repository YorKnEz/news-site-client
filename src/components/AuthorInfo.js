import React from "react"

import "./AuthorInfo.scss"

function AuthorInfo({ fullName, profilePicture, type, subreddit }) {
	if (type === "reddit") {
		return (
			<div className="author">
				<span>Shared by:</span>
				<div
					className="author_avatar"
					style={{ backgroundImage: `url(${profilePicture})` }}
				></div>
				<div className="author_info">
					<span className="author_info_fullname">{fullName}</span>
					<span>
						From:{" "}
						<a className="link" href={`https://www.reddit.com/${subreddit}`}>
							{subreddit}
						</a>
					</span>
				</div>
			</div>
		)
	}

	return (
		<div className="author">
			<span>Made by:</span>
			<div
				className="author_avatar"
				style={{
					backgroundImage: `url(${
						profilePicture !== "default" ? profilePicture : "default_avatar.png"
					})`,
				}}
			></div>
			<div className="author_info">
				<span className="author_info_fullname">{fullName}</span>
				<span className="author_info_from">
					{/* to add link to the news creation page */}
					Created on <em>YorkNews</em>
				</span>
			</div>
		</div>
	)
}

export default AuthorInfo
