import React from "react"
import { Page } from "../components"
import { UserContext } from "../context"
import { useDocumentTitle } from "../utils"

import "./Profile.scss"

function Profile() {
	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] =
		useDocumentTitle("Profile | YorkNews")

	return (
		<Page>
			<div className="profile">
				<UserContext.Consumer>
					{({ user }) => (
						<div className="profile_info">
							{user.profilePicture === "default" ? (
								<img src="default_avatar.png" alt="avatar of user" />
							) : (
								<img src={user.profilePicture} alt="avatar of user" />
							)}
							<div className="profile_info_text">
								<div className="profile_info_text2">
									<h3>{user.fullName}</h3>
									<h4>{user.type}</h4>
								</div>
								<p>{user.email}</p>
							</div>
						</div>
					)}
				</UserContext.Consumer>
			</div>
		</Page>
	)
}

export default Profile
