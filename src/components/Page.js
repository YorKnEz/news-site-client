import React from "react"

import "./Page.scss"
import { Header, Footer } from "../components"

function Page({ children }) {
	return (
		<>
			<Header />
			<div className="page">{children}</div>
			<Footer />
		</>
	)
}

export default Page
