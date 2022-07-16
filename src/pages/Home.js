import React, { useEffect, useState } from "react"

import { useQuery } from "@apollo/client"

import "./Home.scss"
import { NewsCard, Page, QueryResult } from "../components"
import { NEWS_FOR_HOME } from "../utils/apollo-queries"
import { useDocumentTitle } from "../utils/utils"

function Home() {
	const [reachedBottomOfPage, setReachedBottomOfPage] = useState(0)
	const [offsetIndex, setOffsetIndex] = useState(0)
	const [news, setNews] = useState([])
	const { loading, error, data } = useQuery(NEWS, {
		variables: {
			offsetIndex,
		},
	})
	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] = useDocumentTitle("Home | YorkNews")

	useEffect(() => {
		if (data) {
			console.log(data)

			setNews(news => [...news, ...data.newsForHome])
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
		<Page>
			<h1>
				Welcome to{" "}
				<span style={{ fontFamily: "Chomsky", color: "var(--text-color)" }}>
					YorkNews
				</span>
				!
			</h1>

			<p>
				Lorem Ipsum is simply dummy text of the printing and typesetting
				industry. Lorem Ipsum has been the industry's standard dummy text ever
				since the 1500s, when an unknown printer took a galley of type and
				scrambled it to make a type specimen book. It has survived not only five
				centuries, but also the leap into electronic typesetting, remaining
				essentially unchanged. It was popularised in the 1960s with the release
				of Letraset sheets containing Lorem Ipsum passages, and more recently
				with desktop publishing software like Aldus PageMaker including versions
				of Lorem Ipsum.
			</p>

			<div className="news_list">
				{news.map(item => (
					<NewsCard data={item} key={item.id} />
				))}
			</div>
			<QueryResult loading={loading} error={error} data={data} />
		</Page>
	)
}

export default Home
