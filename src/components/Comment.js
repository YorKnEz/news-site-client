/* eslint-disable eqeqeq */
import React, { useContext, useEffect, useState } from "react"
import {
	AiFillSave,
	AiOutlineDelete,
	AiOutlineEdit,
	AiOutlineExpand,
	AiOutlineSave,
} from "react-icons/ai"
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
	SAVE_ITEM,
	UPDATE_REPLIES_COUNTER,
} from "../utils/apollo-queries"

function Button({ onClick, text, children }) {
	return (
		<button onClick={onClick} className="comment_options_item">
			{children}
			{text}
		</button>
	)
}

function Comment({ sortBy, newsId, comment, onCommentEdit, updateCounter }) {
	const { user } = useContext(UserContext)

	const [saved, setSaved] = useState(
		comment.saveState === "save" ? true : false
	)
	const [showEdit, setShowEdit] = useState(false)
	const [showCommentReplies, setShowCommentReplies] = useState(false)
	const [showReply, setShowReply] = useState(false)
	const [collapse, setCollapse] = useState(false)

	const [replies, setReplies] = useState([])
	const [repliesCounter, setRepliesCounter] = useState(comment.replies)
	const [totalReplies, setTotalReplies] = useState(0)
	const [oldestId, setOldestId] = useState("")

	const client = useApolloClient()
	const [removeComment] = useMutation(REMOVE_COMMENT)
	const [updateRepliesCounter] = useMutation(UPDATE_REPLIES_COUNTER)
	const [save] = useMutation(SAVE_ITEM)
	const { loading, error, data } = useQuery(COMMENT_REPLIES, {
		variables: { oldestId, commentId: comment.id, sortBy },
		skip: !showCommentReplies,
	})

	const backgroundImage = `url(${
		comment.author.profilePicture !== "default"
			? comment.author.profilePicture
			: "/default_avatar.png"
	})`

	useEffect(() => {
		if (data) {
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
			if (div) div.innerHTML = comment.body
		}
	}, [comment, collapse, showEdit])

	const showDate = () => {
		const createdAt = fromUnixTime(comment.createdAt / 1000)
		const currentDate = fromUnixTime(Date.now() / 1000)
		const distance = formatDistance(createdAt, currentDate)

		return ` · Posted ${distance} ago`
	}

	const onReplyAdd = reply => {
		setReplies(replies => [reply, ...replies])

		setRepliesCounter(counter => counter + 1)
		setTotalReplies(counter => counter + 1)

		updateCounter()

		if (!showCommentReplies && sortBy === "date") setOldestId(reply.id)

		setShowReply(false)
	}

	const onReplyEdit = comment => {
		let tempArr = replies

		const commentIndex = tempArr.findIndex(c => c.id === comment.id)

		tempArr.splice(commentIndex, 1, comment)

		setReplies([...tempArr])
	}

	const handleEdit = comment => {
		onCommentEdit(comment)

		setShowEdit(false)
	}

	const handleDelete = () => {
		client.clearStore()

		removeComment({
			variables: {
				id: parseInt(comment.id),
			},
			onCompleted: ({ removeComment }) => {
				if (!removeComment.success) {
					console.log(removeComment.message)

					return
				}

				client.clearStore()

				onCommentEdit(removeComment.comment)
			},
			onError: error => console.log({ ...error }),
		})
	}

	const handleSave = () => {
		save({
			variables: {
				action: saved ? "unsave" : "save",
				parentId: comment.id,
				parentType: "comment",
			},
			onCompleted: ({ save }) => {
				if (!save.success) {
					console.log(save.message)

					return
				}

				client.clearStore()

				setSaved(value => !value)
			},
			onError: error => console.log({ ...error }),
		})
	}

	const handleFetchComments = () => {
		if (!showCommentReplies) return setShowCommentReplies(true)

		if (replies.length > 0) setOldestId(replies[replies.length - 1].id)
	}

	const toggleReply = () => setShowReply(value => !value)

	const toggleEdit = () => setShowEdit(value => !value)

	const toggleCollapse = () => setCollapse(value => !value)

	const updateCounterLocal = () => {
		updateRepliesCounter({
			variables: {
				action: "up",
				id: comment.id,
			},
			onCompleted: ({ updateRepliesCounter }) => {
				if (!updateRepliesCounter.success) {
					console.log(updateRepliesCounter.message)

					return
				}

				setRepliesCounter(counter => counter + 1)
				setTotalReplies(counter => counter + 1)
			},
			onError: error => console.log({ ...error }),
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
				{collapse ? (
					<button
						onClick={toggleCollapse}
						className="comment_options_item comment_options_collapse"
					>
						<AiOutlineExpand className="comment_options_item_icon comment_options_collapse_icon" />
					</button>
				) : (
					<>
						<div className="comment_avatar" style={{ backgroundImage }} />
						<div onClick={toggleCollapse} className="comment_line_container">
							<div className="comment_line" />
						</div>
					</>
				)}
			</div>
			<div className="comment_container2">
				<div className="comment_posted">
					{collapse && (
						<div
							className="comment_avatar"
							style={{ marginRight: "8px", backgroundImage }}
						/>
					)}
					<span className="comment_posted_author">
						<Link
							to={`/profile/${comment.author.id}/overview`}
							className="comment_posted_author_link"
						>
							{comment.author.fullName}
						</Link>
						{showDate()}
					</span>
				</div>
				{showEdit && (
					<CommentEditor
						newsId={newsId}
						parentId={comment.parentId}
						parentType={comment.parentType}
						commentToEdit={comment}
						onCommentEdit={handleEdit}
						onEditorCancel={toggleEdit}
					/>
				)}
				{!showEdit && (
					<div
						style={collapse ? { display: "none" } : {}}
						className="comment_body"
						id={`body${comment.id}`}
					></div>
				)}
				<div
					style={collapse ? { display: "none" } : {}}
					className="comment_options"
				>
					<CommentVotes data={comment} />
					<Button onClick={toggleReply} text="Reply">
						<BsReply className="comment_options_item_icon" />
					</Button>
					{saved ? (
						<Button onClick={handleSave} text="Unsave">
							<AiFillSave className="comment_options_item_icon" />
						</Button>
					) : (
						<Button onClick={handleSave} text="Save">
							<AiOutlineSave className="comment_options_item_icon" />
						</Button>
					)}
					{user.id == comment.author.id && (
						<>
							<Button onClick={handleDelete} text="Delete">
								<AiOutlineDelete className="comment_options_item_icon" />
							</Button>
							<Button onClick={toggleEdit} text="Edit">
								<AiOutlineEdit className="comment_options_item_icon" />
							</Button>
						</>
					)}
				</div>
				{showReply && (
					<div
						style={collapse ? { display: "none" } : {}}
						className="comment comment_replies comment_reply"
					>
						<div className="comment_container1">
							<div className="comment_line" style={{ height: "100%" }} />
						</div>
						<CommentEditor
							newsId={newsId}
							parentId={comment.id}
							parentType="comment"
							onCommentAdd={onReplyAdd}
							onEditorCancel={toggleReply}
						/>
					</div>
				)}
				<div
					style={collapse ? { display: "none" } : {}}
					className="comments_list"
				>
					{replies.map(comment => (
						<Comment
							sortBy={sortBy}
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
			</div>
		</div>
	)
}

export default Comment
