import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { useQuery } from "@apollo/client"

import "./NewsComments.scss"
import { Comment } from "../components"
import { UserContext } from "../context"
import { COMMENTS_FOR_NEWS } from "../utils/apollo-queries"

function NewsComments({ newsId, commentsCounter }) {
	const { user } = useContext(UserContext)
	const [offsetIndex, setOffsetIndex] = useState(0)
	const [comments, setComments] = useState([])
	const { loading, error, data } = useQuery(COMMENTS_FOR_NEWS, {
		variables: {
			offsetIndex: offsetIndex,
			newsId: newsId,
		},
	})

	useEffect(() => {
		if (data) {
			console.log(data)
			setComments(comms => [...comms, ...data.commentsForNews])
		}
	}, [data])

	const onCommentRemove = id => {
		let tempArr = comments

		const commentIndex = tempArr.findIndex(comment => comment.id === id)

		tempArr.splice(commentIndex, 1)

	}




		setComments([...tempArr])
	}

	return (
		<div className="comments">
			<div className="comments_input news_padding">
				<span className="comments_input_title">
					Comment as{" "}
					<Link to={`/profile/${user.id}`} className="news_authorlink">
						{user.fullName}
					</Link>
				</span>
				<CommentEditor newsId={newsId} onCommentAdd={onCommentAdd} />
			</div>
			<div className="comments_list">
				{comments.map(comment => (
					<Comment
						key={comment.id}
						data={comment}
						onCommentRemove={onCommentRemove}
					/>
				))}
				<button className="comments_more">
					Show {commentsCounter - comments.length} more comments
				</button>
				<QueryResult loading={loading} error={error} data={data} />
			</div>
		</div>
	)
}

export default NewsComments
