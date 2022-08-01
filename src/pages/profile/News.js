import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"

import { useQuery } from "@apollo/client"

import { UserContext } from "../../context"
import { NEWS_FOR_PROFILE } from "../../utils/apollo-queries"
import { NewsCard, QueryResult } from "../../components"

function News() {
	const { authorId } = useParams()
	const [reachedBottomOfPage, setReachedBottomOfPage] = useState(0)
	const [offset, setOffset] = useState(0)
	const [news, setNews] = useState([])
	const { user } = useContext(UserContext)
	const { loading, error, data } = useQuery(NEWS_FOR_PROFILE, {
		variables: {
			offset,
			id: authorId ? authorId : user.id,
		},
	})

	// update the state after each apollo request
	useEffect(() => {
		if (data) {
			console.log(data)

			setNews(news => [...news, ...data.newsForProfile])
		}
	}, [data])

	// check if user has reached bottom of the page
	useEffect(() => {
		if (reachedBottomOfPage) {
			setReachedBottomOfPage(false)
			setOffset(news.length)
		}
	}, [reachedBottomOfPage, news.length])

	// check if the user scrolled to the bottom of the page so we can request more news only then
	window.addEventListener("scroll", event => {
		const { clientHeight, scrollHeight, scrollTop } =
			event.target.scrollingElement

		if (!loading && !error && scrollHeight - clientHeight === scrollTop) {
			setReachedBottomOfPage(true)
		}
	})
	return (
		<>
			<div className="profile_news">
				{news.map(item => (
					<NewsCard data={item} key={item.id} />
				))}
			</div>
			<QueryResult loading={loading} error={error} data={data} />
		</>
	)
}

export default News
