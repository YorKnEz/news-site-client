import React from "react"
import Footer from "./Footer"
import Header from "./Header"

import "./Page.scss"

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
