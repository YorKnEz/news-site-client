import React, { useEffect, useState } from "react"

import { useQuery } from "@apollo/client"

import "./index.scss"
import {
	HomeSort,
	NewsCard,
	PageWithCards,
	QueryResult,
} from "../../components"
import { NEWS_FOR_HOME } from "../../utils/apollo-queries"
import { useReachedBottom } from "../../utils/utils"

function Feed({ sortBy }) {
	const [news, setNews] = useState([])
	const [oldestId, setOldestId] = useState("")

	const { loading, error, data } = useQuery(NEWS_FOR_HOME, {
		variables: { oldestId, sortBy },
	})
	const [reachedBottom, setReachedBottom] = useReachedBottom(loading, error)

	useEffect(() => {
		setReachedBottom(false)
		setNews([])
		setOldestId("")
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
			<HomeSort sortBy={sortBy} />
			{news.map(item => (
				<NewsCard data={item} key={item.id} />
			))}
			<QueryResult loading={loading} error={error} data={data} />
		</PageWithCards>
	)
}

export default Feed
