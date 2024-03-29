/* eslint-disable eqeqeq */
import React, { useContext, useEffect, useState } from "react"
import {
	AiFillSave as Unsave,
	AiOutlineSave as Save,
	AiOutlineDelete as Delete,
	AiOutlineEdit as Edit,
	AiOutlineExpand,
} from "react-icons/ai"
import { BsReply as Reply } from "react-icons/bs"
import { Link, useParams } from "react-router-dom"

import { useApolloClient, useMutation, useQuery } from "@apollo/client"
import { formatDistance, fromUnixTime } from "date-fns"

import "./Comment.scss"
import {
	Button,
	CardVotes,
	CommentEditor,
	DropdownList,
	QueryResult,
} from "../../components"
import { UserContext } from "../../context"
import {
	COMMENT_REPLIES,
	REMOVE_COMMENT,
	SAVE_ITEM,
} from "../../utils/apollo-queries"

const ip = process.env.REACT_APP_API_IP
const port = process.env.REACT_APP_EXPRESS_API_PORT

function Comment({ depth, sortBy, comment, onCommentEdit, updateCounter }) {
	const { link, newsId } = useParams()

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
	const [oldestId, setOldestId] = useState(-1)

	const client = useApolloClient()
	const [removeComment] = useMutation(REMOVE_COMMENT)
	const [save] = useMutation(SAVE_ITEM)
	const { loading, error, data } = useQuery(COMMENT_REPLIES, {
		variables: { oldestId, commentId: comment.id, sortBy },
		skip: !showCommentReplies,
	})

	const display = collapse ? "none" : ""

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
		setRepliesCounter(counter => counter + 1)
		setTotalReplies(counter => counter + 1)

		updateCounter()
	}

	return (
		<div className={`comment${depth === 0 ? "" : " comment_replies"}`}>
			<div className="comment_container1">
				{collapse ? (
					<Button onClick={toggleCollapse} Icon={AiOutlineExpand} />
				) : (
					<>
						<img
							className="comment_avatar"
							src={`${ip}:${port}/public/${comment.author.profilePicture}`}
							alt="profile"
						/>
						<div onClick={toggleCollapse} className="comment_line_container">
							<div className="comment_line" />
						</div>
					</>
				)}
			</div>
			<div className="comment_container2">
				<div className="comment_posted">
					{collapse && (
						<img
							className="comment_avatar"
							src={`${ip}:${port}/public/${comment.author.profilePicture}`}
							style={{
								marginRight: "8px",
							}}
							alt="profile"
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
						style={{ display }}
						className="comment_body"
						id={`body${comment.id}`}
					></div>
				)}
				<div style={{ display }} className="comment_options">
					<CardVotes data={comment} type="comment" />
					<DropdownList depth={depth}>
						<Button onClick={toggleReply} text="Reply" Icon={Reply} />
						{saved ? (
							<Button onClick={handleSave} text="Unsave" Icon={Unsave} />
						) : (
							<Button onClick={handleSave} text="Save" Icon={Save} />
						)}
						{user.id == comment.author.id && (
							<>
								<Button onClick={handleDelete} text="Delete" Icon={Delete} />
								<Button onClick={toggleEdit} text="Edit" Icon={Edit} />
							</>
						)}
					</DropdownList>
				</div>
				{showReply && (
					<div
						style={{ display }}
						className="comment comment_replies comment_reply"
					>
						<div className="comment_container1">
							<div className="comment_line" />
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
				{depth < 5 ? (
					<div style={{ display }} className="comments_list">
						{replies.map(comment => (
							<Comment
								depth={depth + 1}
								sortBy={sortBy}
								key={comment.id}
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
				) : (
					<Link
						className="comments_more comments_more_replies"
						to={`/news/${link}-${newsId}/comment/${comment.id}`}
						reloadDocument
					>
						Continue thread
					</Link>
				)}
			</div>
		</div>
	)
}

export default Comment
