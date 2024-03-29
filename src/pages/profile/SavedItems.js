import React, { useEffect, useState } from "react"
import { useParams } from "react-router"

import { useQuery } from "@apollo/client"

import {
	CommentCard,
	NewsCard,
	PageWithCards,
	QueryResult,
} from "../../components"
import { SAVED_ITEMS } from "../../utils/apollo-queries"
import { useReachedBottom } from "../../utils/utils"

function SavedItems() {
	const { id } = useParams()

	const [savedItems, setSavedItems] = useState([])
	const [oldestId, setOldestId] = useState(-1)
	const [oldestType, setOldestType] = useState("")

	const { loading, error, data } = useQuery(SAVED_ITEMS, {
		variables: { oldestId, oldestType, userId: id },
	})
	const [reachedBottom, setReachedBottom] = useReachedBottom(loading, error)

	useEffect(() => {
		if (data) setSavedItems(news => [...news, ...data.saved])
	}, [data])

	useEffect(() => {
		if (reachedBottom) {
			setReachedBottom(false)

			if (savedItems.length > 0) {
				const oldestItem = savedItems[savedItems.length - 1]

				setOldestId(oldestItem.id || oldestItem.comment.id)

				// if the oldest item has a title, then it's a news, else it's a comment
				if (oldestItem.title) setOldestType("news")
				else setOldestType("comment")
			}
		}
	}, [reachedBottom, setReachedBottom, savedItems])

	const onCommentEdit = comment => {
		setSavedItems(arr =>
			arr.map(item => {
				if (
					item.__typename === "CommentCard" &&
					comment.id === item.comment.id
				) {
					return { ...item, comment: { ...item.comment, body: comment.body } }
				}

				return item
			})
		)
	}

	return (
		<PageWithCards>
			<div className="profile_news">
				{savedItems.map(item => {
					if (item.title)
						return <NewsCard key={`news-${item.id}`} data={item} />
					else
						return (
							<CommentCard
								key={`comm-${item.comment.id}`}
								data={item}
								onCommentEdit={onCommentEdit}
							/>
						)
				})}
				<QueryResult loading={loading} error={error} data={data} />
			</div>
		</PageWithCards>
	)
}

export default SavedItems
