import axios from "axios"
import React, { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import "./VerifyEmail.scss"
import { Page } from "../components"
import { UserContext } from "../context"

const ip = window._env_.REACT_APP_EXPRESS_API_IP

function VerifyEmail() {
	const { token } = useParams()

	const { verifyEmail } = useContext(UserContext)
	const [message, setMessage] = useState("")
	const [error, setError] = useState("")

	useEffect(() => {
		const verify = async () => {
			try {
				const { data, status } = await axios({
					method: "get",
					url: `${ip}/users/verify?token=${token}`,
				})

				setMessage(data.message)

				if (status === 200) {
					verifyEmail(data.userId)
				}
			} catch (error) {
				setError(error?.response?.data?.message || error.message)
			}
		}

		verify()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token])

	return (
		<Page>
			<div className="verify">
				{message && <span className="verify_message">{message}</span>}
				{error && <span className="verify_error">{error}</span>}
				{(message || error) && (
					<Link to="/" className="button button_link button_primary">
						Return home
					</Link>
				)}
			</div>
		</Page>
	)
}

export default VerifyEmail
