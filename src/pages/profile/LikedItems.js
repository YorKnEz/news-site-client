import React, { useEffect, useState } from "react"

import { useQuery } from "@apollo/client"

import {
	CommentCard,
	NewsCard,
	PageWithCards,
	QueryResult,
} from "../../components"
import { LIKED_ITEMS } from "../../utils/apollo-queries"

function LikedItems() {
	const [reachedBottomOfPage, setReachedBottomOfPage] = useState(0)
	const [likedItems, setLikedItems] = useState([])
	const [oldestId, setOldestId] = useState("")
	const [oldestType, setOldestType] = useState("")

	const { loading, error, data } = useQuery(LIKED_ITEMS, {
		variables: { oldestId, oldestType },
	})

	useEffect(() => {
		if (data) {
			console.log(data)

			setLikedItems(news => [...news, ...data.liked])
		}
	}, [data])

	useEffect(() => {
		if (reachedBottomOfPage) {
			setReachedBottomOfPage(false)

			if (likedItems.length > 0) {
				const oldestItem = likedItems[likedItems.length - 1]

				setOldestId(oldestItem.id || oldestItem.comment.id)

				// if the oldest item has a title, then it's a news, else it's a comment
				if (oldestItem.title) setOldestType("news")
				else setOldestType("comment")
			}
		}
	}, [reachedBottomOfPage, likedItems])

	// check if the user scrolled to the bottom of the page so we can request more news only then
	window.addEventListener("scroll", event => {
		const { clientHeight, scrollHeight, scrollTop } =
			event.target.scrollingElement

		if (!loading && !error && scrollHeight - clientHeight === scrollTop) {
			setReachedBottomOfPage(true)
		}
	})

	return (
		<PageWithCards>
			<div className="profile_news">
				{likedItems.map(item => {
					if (item.title)
						return <NewsCard key={`news-${item.id}`} data={item} />
					else
						return <CommentCard key={`comm-${item.comment.id}`} data={item} />
				})}
				<QueryResult loading={loading} error={error} data={data} />
			</div>
		</PageWithCards>
	)
}

export default LikedItems
