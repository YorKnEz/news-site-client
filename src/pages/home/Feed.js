import React, { useEffect, useState } from "react"

import { useQuery } from "@apollo/client"

import "./index.scss"
import {
	HomeNavigation,
	HomeSort,
	NewsCard,
	PageWithCards,
	QueryResult,
} from "../../components"
import { NEWS_FOR_HOME } from "../../utils/apollo-queries"
import { useReachedBottom } from "../../utils/utils"

function Feed() {
	const path = window.location.pathname
	const [page, setPage] = useState(
		path.includes("followed") ? "/followed/" : "/"
	)
	const [sortBy, setSortBy] = useState(path.includes("new") ? "date" : "score")
	const [news, setNews] = useState([])
	const [oldestId, setOldestId] = useState(-1)

	const { loading, error, data } = useQuery(NEWS_FOR_HOME, {
		variables: { oldestId, sortBy, followed: page.includes("followed") },
	})
	const [reachedBottom, setReachedBottom] = useReachedBottom(loading, error)

	useEffect(() => {
		setReachedBottom(false)
		setNews([])
		setOldestId(-1)
	}, [sortBy, setReachedBottom])

	useEffect(() => {
		if (data) setNews(news => [...news, ...data.newsForHome])
	}, [data])

	useEffect(() => {
		if (reachedBottom) {
			setReachedBottom(false)
			if (news.length > 0) setOldestId(news[news.length - 1].id)
		}
	}, [reachedBottom, setReachedBottom, news])

	return (
		<PageWithCards>
			<HomeNavigation page={page} setPage={setPage} />
			<HomeSort page={page} sortBy={sortBy} setSortBy={setSortBy} />
			{news.map(item => (
				<NewsCard data={item} key={item.id} />
			))}
			<QueryResult loading={loading} error={error} data={data} />
		</PageWithCards>
	)
}

export default Feed
