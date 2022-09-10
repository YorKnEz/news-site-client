import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import { useQuery } from "@apollo/client"

import "./NewsComments.scss"
import { Comment, CustomSelect, QueryResult } from ".."
import { COMMENT_FOR_THREAD } from "../../utils/apollo-queries"

function ThreadComments({ setCommentsCounter }) {
	const { newsId, link, commentId } = useParams()

	// const { user } = useContext(UserContext)
	const [comment, setComment] = useState({})
	const [backLink, setBackLink] = useState("")
	const [sortBy, setSortBy] = useState("score")

	const { loading, error, data } = useQuery(COMMENT_FOR_THREAD, {
		variables: { depth: 6, commentId },
	})

	const options = [
		{ id: "score", text: "Best" },
		{ id: "date", text: "New" },
	]

	useEffect(() => {
		if (data) {
			setComment(data.commentById)
			setBackLink(
				data.commentNthParentId === "-1"
					? ""
					: `/comment/${data.commentNthParentId}`
			)
		}
	}, [data])

	const onCommentEdit = comment => {
		setComment(comment)
	}

	const handlePage = ({ id }) => {
		setComment({})
		setSortBy(id)
	}

	const updateCounterLocal = () => {
		setCommentsCounter(counter => counter + 1)
	}

	return (
		<div className="comments">
			<div className="comments_container">
				<div className="comments_sort">
					<CustomSelect
						defaultItem={options[0]}
						list={options}
						setSelectedItem={handlePage}
					/>
					<hr style={{ marginBottom: 0 }} />
				</div>
				<div className="thread_links">
					<Link
						className="comments_more comments_more_replies"
						to={`/news/${link}-${newsId}${backLink}`}
						reloadDocument
					>
						Go back
					</Link>
					<Link
						className="comments_more comments_more_replies"
						to={`/news/${link}-${newsId}`}
						reloadDocument
					>
						See all comments
					</Link>
				</div>
			</div>
			<div className="comments_list">
				{comment?.id && (
					<Comment
						depth={0}
						sortBy={sortBy}
						comment={comment}
						onCommentEdit={onCommentEdit}
						updateCounter={updateCounterLocal}
					/>
				)}
				<QueryResult loading={loading} error={error} data={data} />
			</div>
		</div>
	)
}

export default ThreadComments
