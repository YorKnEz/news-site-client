/* eslint-disable eqeqeq */
import React, { useContext, useEffect, useState } from "react"
import { AiOutlineDelete, AiOutlineEdit, AiOutlineExpand } from "react-icons/ai"
import { BsReply } from "react-icons/bs"
import { Link } from "react-router-dom"

import { useApolloClient, useMutation, useQuery } from "@apollo/client"
import { formatDistance, fromUnixTime } from "date-fns"

import "./Comment.scss"
import { CommentEditor, CommentVotes, QueryResult } from "../components"
import { UserContext } from "../context"
import {
	COMMENT_REPLIES,
	REMOVE_COMMENT,
	UPDATE_REPLIES_COUNTER,
} from "../utils/apollo-queries"

function Comment({ newsId, comment, onCommentEdit, updateCounter }) {
	const { user } = useContext(UserContext)
	const [showEdit, setShowEdit] = useState(false)
	const [showCommentReplies, setShowCommentReplies] = useState(false)
	const [showReply, setShowReply] = useState(false)
	const [collapse, setCollapse] = useState(false)
	const [replies, setReplies] = useState([])
	const [repliesCounter, setRepliesCounter] = useState(comment.replies)
	const [totalReplies, setTotalReplies] = useState(0)
	const [offset, setOffset] = useState(0)
	const [oldestCommentDate, setOldestCommentDate] = useState(
		`${new Date().getTime()}`
	)

	const client = useApolloClient()
	const [removeComment] = useMutation(REMOVE_COMMENT)
	const [updateRepliesCounter] = useMutation(UPDATE_REPLIES_COUNTER)
	const { loading, error, data } = useQuery(COMMENT_REPLIES, {
		variables: {
			offset,
			oldestCommentDate,
			commentId: comment.id,
		},
		skip: !showCommentReplies,
	})

	useEffect(() => {
		if (data) {
			console.log(data)

			setReplies(comms => {
				let tempArr = [...comms, ...data.commentReplies]

				setTotalReplies(
					tempArr.length +
						tempArr.reduce((prev, curr) => prev + curr.replies, 0)
				)

				return [...tempArr]
			})
		}
	}, [data])

	useEffect(() => {
		if (comment) {
			// get the body
			const div = document.getElementById(`body${comment.id}`)

			// inject the html
			div.innerHTML = comment.body
		}
	}, [comment])

	const showDate = () => {
		const createdAt = fromUnixTime(comment.createdAt / 1000)
		const currentDate = fromUnixTime(Date.now() / 1000)
		const distance = formatDistance(createdAt, currentDate)

		return ` - Posted ${distance} ago`
	}

	const onCommentReplyCancel = e => {
		e.preventDefault()

		setShowReply(false)
	}

	const onReplyAdd = reply => {
		setReplies(replies => [reply, ...replies])

		setRepliesCounter(counter => counter + 1)
		setTotalReplies(counter => counter + 1)

		updateCounter()

		if (!showCommentReplies) setOldestCommentDate(reply.createdAt)

		setShowReply(false)
	}

	const onReplyEdit = comment => {
		let tempArr = replies

		const commentIndex = tempArr.findIndex(c => c.id === comment.id)

		tempArr.splice(commentIndex, 1, comment)

		setReplies([...tempArr])
	}

	const handleReply = e => {
		e.preventDefault()

		setShowReply(value => !value)
	}

	const handleEdit = comment => {
		onCommentEdit(comment)

		setShowEdit(false)
	}

	const handleDelete = e => {
		e.preventDefault()

		client.clearStore()

		removeComment({
			variables: {
				id: parseInt(comment.id),
			},
			onCompleted: data => {
				client.clearStore()

				console.log(data)
				onCommentEdit(data.removeComment.comment)
			},
		})
	}

	const handleFetchComments = e => {
		e.preventDefault()

		if (!showCommentReplies) {
			setShowCommentReplies(true)

			return
		}

		setOffset(replies.length)
		setOldestCommentDate(replies[replies.length - 1].createdAt)
	}

	const toggleCollapse = e => {
		e.preventDefault()

		setCollapse(value => !value)
	}

	const updateCounterLocal = () => {
		updateRepliesCounter({
			variables: {
				action: "up",
				id: comment.id,
			},
			onCompleted: res => {
				console.log(res)

				setRepliesCounter(counter => counter + 1)
				setTotalReplies(counter => counter + 1)
			},
		})

		updateCounter()
	}

	return (
		<div
			className={`comment ${
				comment.parentType === "comment" && "comment_replies"
			}`}
		>
			<div className="comment_container1">
				<div
					className="comment_avatar"
					style={{
						backgroundImage: `url(${
							comment.author.profilePicture !== "default"
								? comment.author.profilePicture
								: "/default_avatar.png"
						})`,
					}}
				></div>
				{collapse ? (
					<button
						onClick={toggleCollapse}
						className="comment_options_item comment_options_collapse"
					>
						<AiOutlineExpand className="comment_options_item_icon comment_options_collapse_icon" />
					</button>
				) : (
					<div onClick={toggleCollapse} className="comment_line_container">
						<div className="comment_line" />
					</div>
				)}
			</div>
			<div className="comment_container2">
				<div className="comment_posted">
					<span className="comment_posted_author">
						<Link
							to={`/profile/${comment.author.id}`}
							className="comment_posted_author_link"
						>
							{comment.author.fullName}
						</Link>
						{showDate()}
					</span>
				</div>
				{!collapse &&
					(showEdit ? (
						<CommentEditor
							parentId={comment.parentId}
							parentType={comment.parentType}
							commentToEdit={comment}
							onCommentEdit={handleEdit}
						/>
					) : (
						<div className="comment_body" id={`body${comment.id}`}></div>
					))}
				{!collapse && (
					<div className="comment_options">
						<CommentVotes data={comment} />
						<button onClick={handleReply} className="comment_options_item">
							<BsReply className="comment_options_item_icon" />
							Reply
						</button>
						{user.id == comment.author.id && (
							<>
								<button onClick={handleDelete} className="comment_options_item">
									<AiOutlineDelete className="comment_options_item_icon" />
									Delete
								</button>
								<button
									onClick={e => {
										e.preventDefault()
										setShowEdit(true)
									}}
									className="comment_options_item"
								>
									<AiOutlineEdit className="comment_options_item_icon" />
									Edit
								</button>
							</>
						)}
					</div>
				)}
				{!collapse && showReply && (
					<div className="comment comment_replies comment_reply">
						<div className="comment_container1">
							<div className="comment_line" style={{ height: "100%" }} />
						</div>
						<CommentEditor
							parentId={comment.id}
							parentType="comment"
							onCommentAdd={onReplyAdd}
							onCommentReplyCancel={onCommentReplyCancel}
						/>
					</div>
				)}
				{!collapse && (
					<div className="comments_list">
						{replies.map(comment => (
							<Comment
								key={comment.id}
								newsId={newsId}
								comment={comment}
								onCommentEdit={onReplyEdit}
								updateCounter={updateCounterLocal}
							/>
						))}
						{repliesCounter - totalReplies > 0 && (
							<button
								onClick={handleFetchComments}
								className="comments_more comments_more_replies"
							>
								Show {repliesCounter - totalReplies} more comments
							</button>
						)}
						<QueryResult loading={loading} error={error} data={data} />
					</div>
				)}
			</div>
		</div>
	)
}

export default Comment
