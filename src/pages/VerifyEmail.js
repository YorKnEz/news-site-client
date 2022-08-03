import axios from "axios"
import React, { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import "./VerifyEmail.scss"
import { Page } from "../components"
import { UserContext } from "../context"

const ip = process.env.REACT_APP_EXPRESS_API_IP

function VerifyEmail() {
	const { token } = useParams()

	const { verifyEmail } = useContext(UserContext)
	const [message, setMessage] = useState("")
	const [error, setError] = useState("")

	useEffect(() => {
		const verify = async () => {
			try {
				const res = await axios({
					method: "get",
					url: `${ip}/users/verify?token=${token}`,
				})

				setMessage(res.data)

				if (res.status === 200) {
					verifyEmail()
				}
			} catch (error) {
				setError(error?.response?.data?.message || error.message)
			}
		}

		verify()
	}, [token])

	return (
		<Page>
			<div className="verify">
				{message && <span className="verify_message">{message}</span>}
				{error && <span className="verify_error">{error}</span>}
				{(message || error) && (
					<Link to="/" className="button button_primary">
						Return home
					</Link>
				)}
			</div>
		</Page>
	)
}

export default VerifyEmail