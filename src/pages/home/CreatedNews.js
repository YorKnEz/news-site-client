import React, { useEffect, useState } from "react"

import { useQuery } from "@apollo/client"

import "./index.scss"
import { NewsCard, QueryResult } from "../../components"
import { NEWS_FOR_HOME } from "../../utils/apollo-queries"
import { AiOutlineRocket } from "react-icons/ai"
import { MdOutlineNewReleases } from "react-icons/md"

function CreatedNews() {
	const [reachedBottomOfPage, setReachedBottomOfPage] = useState(0)
	const [news, setNews] = useState([])
	const [oldestId, setOldestId] = useState("")
	const [sortBy, setSortBy] = useState("score")

	const { loading, error, data } = useQuery(NEWS_FOR_HOME, {
		variables: {
			oldestId,
			sortBy,
		},
	})

	useEffect(() => {
		if (data) {
			console.log(data)
			setNews(news => [...news, ...data.newsForHome])
		}
	}, [data])

	useEffect(() => {
		if (reachedBottomOfPage) {
			setReachedBottomOfPage(false)
			if (news.length > 0) setOldestId(news[news.length - 1].id)
		}
	}, [reachedBottomOfPage, news])

	// check if the user scrolled to the bottom of the page so we can request more news only then
	window.addEventListener("scroll", event => {
		const { clientHeight, scrollHeight, scrollTop } =
			event.target.scrollingElement

		if (!loading && !error && scrollHeight - clientHeight === scrollTop) {
			setReachedBottomOfPage(true)
		}
	})

	const handleClick = (sortCriteria, e) => {
		e.preventDefault()

		// find the old active button
		const oldActiveButton = document.getElementById(sortBy)
		// remove the active class
		oldActiveButton.classList.remove("news_pages_item_active")

		// find the new button to active
		const activeButton = document.getElementById(sortCriteria)
		// add the active class
		activeButton.classList.add("news_pages_item_active")

		setNews([])
		setOldestId("")
		setSortBy(sortCriteria)
	}

	return (
		<div className="news_list">
			<div className="news_pages">
				<button
					id="score"
					onClick={e => handleClick("score", e)}
					className="news_pages_item news_pages_item_active"
				>
					<AiOutlineRocket className="news_pages_item_icon" />
					Best
				</button>
				<button
					id="date"
					onClick={e => handleClick("date", e)}
					className="news_pages_item"
				>
					<MdOutlineNewReleases className="news_pages_item_icon" />
					New
				</button>
			</div>
			{news.map(item => (
				<NewsCard data={item} key={item.id} />
			))}
			<QueryResult loading={loading} error={error} data={data} />
		</div>
	)
}

export default CreatedNews
