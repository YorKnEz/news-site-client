import React, { useEffect, useState } from "react"

import { useQuery } from "@apollo/client"

import { CommentCard, NewsCard, QueryResult } from "../../components"
import { SAVED_ITEMS } from "../../utils/apollo-queries"

function SavedItems() {
	const [reachedBottomOfPage, setReachedBottomOfPage] = useState(0)
	const [savedItems, setSavedItems] = useState([])
	const [oldestId, setOldestId] = useState("")
	const [oldestType, setOldestType] = useState("")

	const { loading, error, data } = useQuery(SAVED_ITEMS, {
		variables: { oldestId, oldestType },
	})

	useEffect(() => {
		if (data) {
			console.log(data)

			setSavedItems(news => [...news, ...data.saved])
		}
	}, [data])

	useEffect(() => {
		if (reachedBottomOfPage) {
			setReachedBottomOfPage(false)

			if (savedItems.length > 0) {
				const oldestItem = savedItems[savedItems.length - 1]

				setOldestId(oldestItem.id)

				// if the oldest item has a title, then it's a news, else it's a comment
				if (oldestItem.title) setOldestType("news")
				else setOldestType("comment")
			}
		}
	}, [reachedBottomOfPage, savedItems])

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
			{savedItems.map(item => {
				if (item.title) return <NewsCard key={`news-${item.id}`} data={item} />
				else return <CommentCard key={`comm-${item.id}`} data={item} />
			})}
			<QueryResult loading={loading} error={error} data={data} />
		</div>
	)
}

export default SavedItems
