import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { useMutation, useQuery } from "@apollo/client"

import "./NewsComments.scss"
import { Comment, QueryResult, CommentEditor } from "../components"
import { UserContext } from "../context"
import {
	COMMENTS_FOR_NEWS,
	UPDATE_COMMENTS_COUNTER,
} from "../utils/apollo-queries"
import { AiFillExclamationCircle } from "react-icons/ai"

function NewsComments({ newsId, commentsCounter, setCommentsCounter }) {
	const { user } = useContext(UserContext)
	const [editorError, setEditorError] = useState("")
	const [comments, setComments] = useState([])
	const [oldestCommentDate, setOldestCommentDate] = useState(
		`${new Date().getTime()}`
	)
	const [totalReplies, setTotalReplies] = useState(0)

	const [updateCommentsCounter] = useMutation(UPDATE_COMMENTS_COUNTER)
	const { loading, error, data } = useQuery(COMMENTS_FOR_NEWS, {
		variables: {
			oldestCommentDate,
			newsId,
		},
	})

	useEffect(() => {
		if (data) {
			setComments(comms => {
				let tempArr = [...comms, ...data.commentsForNews]

				setTotalReplies(
					tempArr.length +
						tempArr.reduce((prev, curr) => prev + curr.replies, 0)
				)

				return [...tempArr]
			})
		}
	}, [data])

	const onCommentAdd = comment => {
		setComments(comments => [comment, ...comments])

		setCommentsCounter(counter => counter + 1)
		setTotalReplies(counter => counter + 1)
	}

	const onCommentEdit = comment => {
		let tempArr = comments

		const commentIndex = tempArr.findIndex(c => c.id === comment.id)

		tempArr.splice(commentIndex, 1, comment)

		setComments([...tempArr])
	}

	const handleFetchComments = e => {
		e.preventDefault()

		setOldestCommentDate(comments[comments.length - 1].createdAt)
	}

	const updateCounterLocal = () => {
		updateCommentsCounter({
			variables: {
				action: "up",
				id: newsId,
			},
			onCompleted: ({ updateCommentsCounter }) => {
				if (!updateCommentsCounter.success) {
					console.log(updateCommentsCounter.message)

					return
				}

				setCommentsCounter(counter => counter + 1)
				setTotalReplies(counter => counter + 1)
			},
			onError: error => console.log({ ...error }),
		})
	}

	return (
		<div className="comments">
			<div className="comments_input">
				<span className="comments_input_title news_padding">
					Comment as{" "}
					<Link to={`/profile/${user.id}`} className="news_authorlink">
						{user.fullName}
					</Link>
				</span>
				<CommentEditor
					setError={setEditorError}
					parentId={newsId}
					parentType="news"
					onCommentAdd={onCommentAdd}
				/>
				{editorError && (
					<p className="comment_error">
						<AiFillExclamationCircle className="comment_error_icon" />
						{editorError}
					</p>
				)}
			</div>
			<div className="comments_list">
				{comments.map(comment => (
					<Comment
						key={comment.id}
						newsId={newsId}
						comment={comment}
						onCommentEdit={onCommentEdit}
						updateCounter={updateCounterLocal}
					/>
				))}
				{commentsCounter - totalReplies > 0 && (
					<button onClick={handleFetchComments} className="comments_more">
						Show {commentsCounter - totalReplies} more comments
					</button>
				)}
				<QueryResult loading={loading} error={error} data={data} />
			</div>
		</div>
	)
}

export default NewsComments
