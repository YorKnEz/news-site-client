import React, { useEffect, useState } from "react"

import { useQuery } from "@apollo/client"

import { NewsCard2 } from "../../components"
import { LIKED_NEWS } from "../../utils/apollo-queries"

function LikedNews() {
	const [reachedBottomOfPage, setReachedBottomOfPage] = useState(0)
	const [offsetIndex, setOffsetIndex] = useState(0)
	const [likedNews, setLikedNews] = useState([])
	const { loading, error, data } = useQuery(LIKED_NEWS, {
		variables: { offsetIndex },
	})

	useEffect(() => {
		if (data) {
			console.log(data)

			setLikedNews(news => [...news, ...data.likedNews])
		}
	}, [data])

	useEffect(() => {
		if (reachedBottomOfPage) {
			setReachedBottomOfPage(false)
			setOffsetIndex(offsetIndex + 1)
		}
	}, [reachedBottomOfPage, offsetIndex])

	// check if the user scrolled to the bottom of the page so we can request more news only then
	window.addEventListener("scroll", event => {
		const { clientHeight, scrollHeight, scrollTop } =
			event.target.scrollingElement

		if (!loading && !error && scrollHeight - clientHeight === scrollTop) {
			setReachedBottomOfPage(true)
		}
	})

	return (
		<div className="profile_news">
			{likedNews.map(news => (
				<NewsCard2 key={news.id} data={news} />
			))}
		</div>
	)
}

export default LikedNews
