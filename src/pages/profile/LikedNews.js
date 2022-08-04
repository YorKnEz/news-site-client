import React, { useEffect, useState } from "react"

import { useQuery } from "@apollo/client"

import { NewsCard, QueryResult } from "../../components"
import { LIKED_NEWS } from "../../utils/apollo-queries"

function LikedNews() {
	const [reachedBottomOfPage, setReachedBottomOfPage] = useState(0)
	const [likedNews, setLikedNews] = useState([])
	const [oldestId, setOldestId] = useState("")

	const { loading, error, data } = useQuery(LIKED_NEWS, {
		variables: { oldestId },
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
			if (likedNews.length > 0) setOldestId(likedNews[likedNews.length - 1].id)
		}
	}, [reachedBottomOfPage, likedNews])

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
