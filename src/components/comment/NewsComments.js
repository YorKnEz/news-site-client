import React, { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import { useQuery } from "@apollo/client"

import "./NewsComments.scss"
import {
	Comment,
	CustomSelect,
	QueryResult,
	CommentEditor,
} from "../../components"
import { UserContext } from "../../context"
import { COMMENTS_FOR_NEWS } from "../../utils/apollo-queries"

function NewsComments({ commentsCounter, setCommentsCounter }) {
	const { newsId } = useParams()

	const { user } = useContext(UserContext)
	const [comments, setComments] = useState([])
	const [totalReplies, setTotalReplies] = useState(0)
	const [oldestId, setOldestId] = useState(-1)
	const [sortBy, setSortBy] = useState("score")

	const { loading, error, data } = useQuery(COMMENTS_FOR_NEWS, {
		variables: { oldestId, newsId, sortBy },
	})

	const options = [
		{ id: "score", text: "Best" },
		{ id: "date", text: "New" },
	]

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

	const handleFetchComments = () =>
		setOldestId(comments[comments.length - 1].id)

	const handlePage = ({ id }) => {
		setComments([])
		setOldestId(-1)
		setSortBy(id)
	}

	const updateCounterLocal = () => {
		setCommentsCounter(counter => counter + 1)
		setTotalReplies(counter => counter + 1)
	}

	return (
		<div className="comments">
			<div className="comments_container">
				<div className="comments_input">
					<span className="comments_input_title">
						Comment as{" "}
						<Link
							to={`/profile/${user.id}/overview`}
							className="news_authorlink"
						>
							{user.fullName}
						</Link>
					</span>
					<CommentEditor
						newsId={newsId}
						parentId={newsId}
						parentType="news"
						onCommentAdd={onCommentAdd}
					/>
				</div>
				<div className="comments_sort">
					<CustomSelect
						defaultItem={options[0]}
						list={options}
						setSelectedItem={handlePage}
					/>
					<hr style={{ marginBottom: 0 }} />
				</div>
			</div>
			<div className="comments_list">
				{comments.map(comment => (
					<Comment
						depth={0}
						sortBy={sortBy}
						key={comment.id}
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
