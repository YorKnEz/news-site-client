import React, { useEffect, useState } from "react"

import { useQuery } from "@apollo/client"

import { NewsCard, QueryResult } from "../../components"
import { LIKED_NEWS } from "../../utils/apollo-queries"

function LikedNews() {
	const [reachedBottomOfPage, setReachedBottomOfPage] = useState(0)
	const [offset, setOffset] = useState(0)
	const [likedNews, setLikedNews] = useState([])
	const { loading, error, data } = useQuery(LIKED_NEWS, {
		variables: { offset },
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
			setOffset(likedNews.length)
		}
	}, [reachedBottomOfPage, likedNews.length])

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
				<NewsCard key={news.id} data={news} />
			))}
			<QueryResult loading={loading} error={error} data={data} />
		</div>
	)
}

export default LikedNews
