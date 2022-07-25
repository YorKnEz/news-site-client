import React, { useState } from "react"

import "./index.scss"
import { Page } from "../../components"
import { CreatedNews, MixedNews, RedditNews } from "../home"
import { useDocumentTitle } from "../../utils/utils"

function Home() {
	const [page, setPage] = useState("yorknews")
	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] = useDocumentTitle("Home | YorkNews")

	const handleClick = (newPage, e) => {
		e.preventDefault()

		// find the old active button
		const oldActiveButton = document.getElementById(page)
		// remove the active class
		oldActiveButton.classList.remove("news_pages_item_active")

		// find the new button to active
		const activeButton = document.getElementById(newPage)
		// add the active class
		activeButton.classList.add("news_pages_item_active")

		setPage(newPage)
	}

	return (
		<Page>
			<div className="news_pages">
				<button
					id="yorknews"
					onClick={e => handleClick("yorknews", e)}
					className="news_pages_item news_pages_item_active"
				>
					YorkNews
				</button>
				<button
					id="reddit"
					onClick={e => handleClick("reddit", e)}
					className="news_pages_item"
				>
					r/Romania
				</button>
				<button
					id="mixed"
					onClick={e => handleClick("mixed", e)}
					className="news_pages_item"
				>
					Mix
				</button>
			</div>
			{page === "yorknews" ? (
				<CreatedNews />
			) : page === "reddit" ? (
				<RedditNews />
			) : (
				<MixedNews />
			)}
		</Page>
	)
}

export default Home
