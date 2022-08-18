import React, { useEffect, useState } from "react"

import { useQuery } from "@apollo/client"

import "./index.scss"
import {
	HomeSort,
	PageWithCards,
	QueryResult,
	RedditNewsCard,
} from "../../components"
import { NEWS_FOR_HOME_REDDIT } from "../../utils/apollo-queries"
import { useReachedBottom } from "../../utils/utils"

function RedditNews() {
	const [after, setAfter] = useState("")
	const [news, setNews] = useState([])

	const { loading, error, data } = useQuery(NEWS_FOR_HOME_REDDIT, {
		variables: { after },
	})
	const [reachedBottom, setReachedBottom] = useReachedBottom(loading, error)

	useEffect(() => {
		if (data) setNews(news => [...news, ...data.newsForHomeReddit.news])
	}, [data])

	useEffect(() => {
		if (reachedBottom) {
			setReachedBottom(false)
			if (data) setAfter(data.newsForHomeReddit.after)
		}
	}, [reachedBottom, setReachedBottom, after, data])

	return (
		<PageWithCards>
			<HomeSort sortBy="reddit" />
			{news.map(item => (
				<RedditNewsCard data={item} key={item.id} />
			))}
			<QueryResult loading={loading} error={error} data={data} />
		</PageWithCards>
	)
}

export default RedditNews
