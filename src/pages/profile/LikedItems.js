import React, { useEffect, useState } from "react"
import { useParams } from "react-router"

import { useQuery } from "@apollo/client"

import {
	CommentCard,
	NewsCard,
	PageWithCards,
	QueryResult,
} from "../../components"
import { LIKED_ITEMS } from "../../utils/apollo-queries"
import { useReachedBottom } from "../../utils/utils"

function LikedItems() {
	const { id } = useParams()

	const [likedItems, setLikedItems] = useState([])
	const [oldestId, setOldestId] = useState("")
	const [oldestType, setOldestType] = useState("")

	const { loading, error, data } = useQuery(LIKED_ITEMS, {
		variables: { oldestId, oldestType, userId: id },
	})
	const [reachedBottom, setReachedBottom] = useReachedBottom(loading, error)

	useEffect(() => {
		if (data) setLikedItems(news => [...news, ...data.liked])
	}, [data])

	useEffect(() => {
		if (reachedBottom) {
			setReachedBottom(false)

			if (likedItems.length > 0) {
				const oldestItem = likedItems[likedItems.length - 1]

				setOldestId(oldestItem.id || oldestItem.comment.id)

				// if the oldest item has a title, then it's a news, else it's a comment
				if (oldestItem.title) setOldestType("news")
				else setOldestType("comment")
			}
		}
	}, [reachedBottom, setReachedBottom, likedItems])

	const onCommentEdit = comment => {
		setLikedItems(arr =>
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
				{likedItems.map(item => {
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

export default LikedItems
