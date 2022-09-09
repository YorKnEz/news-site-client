import React, { useEffect, useState } from "react"
import { useParams } from "react-router"

import { useQuery } from "@apollo/client"

import { NEWS_FOR_PROFILE } from "../../utils/apollo-queries"
import { NewsCard, PageWithCards, QueryResult } from "../../components"
import { useReachedBottom } from "../../utils/utils"

function News() {
	const { id } = useParams()

	const [news, setNews] = useState([])
	const [oldestId, setOldestId] = useState(-1)

	const { loading, error, data } = useQuery(NEWS_FOR_PROFILE, {
		variables: { oldestId, id },
	})
	const [reachedBottom, setReachedBottom] = useReachedBottom(loading, error)

	// update the state after each apollo request
	useEffect(() => {
		if (data) setNews(news => [...news, ...data.newsForProfile])
	}, [data])

	// check if user has reached bottom of the page
	useEffect(() => {
		if (reachedBottom) {
			setReachedBottom(false)
			if (news.length > 0) setOldestId(news[news.length - 1].id)
		}
	}, [reachedBottom, setReachedBottom, news])

	return (
		<PageWithCards>
			<div className="profile_news">
				{news.map(item => (
					<NewsCard data={item} key={item.id} />
				))}
				<QueryResult loading={loading} error={error} data={data} />
			</div>
		</PageWithCards>
	)
}

export default News
