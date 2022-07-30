/* eslint-disable eqeqeq */
import React, { useContext, useEffect, useState } from "react"
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"
import { BsReply } from "react-icons/bs"
import { Link } from "react-router-dom"

import { useApolloClient, useMutation } from "@apollo/client"
import { formatDistance, fromUnixTime } from "date-fns"

import "./Comment.scss"
import { CommentEditor, CommentVotes } from "../components"
import { UserContext } from "../context"
import { REMOVE_COMMENT } from "../utils/apollo-queries"

function Comment({ comment, onCommentAdd, onCommentEdit, onCommentRemove }) {
	const client = useApolloClient()
	const { user } = useContext(UserContext)
	const [removeComment] = useMutation(REMOVE_COMMENT)
	const [showEdit, setShowEdit] = useState(false)

	const showDate = () => {
		const createdAt = fromUnixTime(comment.createdAt / 1000)
		const currentDate = fromUnixTime(Date.now() / 1000)
		const distance = formatDistance(createdAt, currentDate)

		return `  -  Posted ${distance} ago`
	}
	const [showReply, setShowReply] = useState(false)

	useEffect(() => {
		if (comment) {
			// get the body
			const div = document.getElementById(`body${comment.id}`)

			// inject the html
			div.innerHTML = comment.body
		}
	}, [comment])


	const onCommentReplyCancel = e => {
		e.preventDefault()

		setShowReply(false)
	}

	const onReplyAdd = reply => {
		setReplies(replies => [reply, ...replies])

		setShowReply(false)
	}

	const handleReply = e => {
		e.preventDefault()

		setShowReply(value => !value)
	}

	const handleDelete = e => {
		e.preventDefault()

		removeComment({
			variables: {
				id: parseInt(comment.id),
			},
			onCompleted: data => {
				client.clearStore()

				console.log(data)
				onCommentRemove(comment.id)
			},
		})
	}

	const handleEdit = comment => {
		onCommentEdit(comment)

		setShowEdit(false)
	}

	return (
		<div className="comment">
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
				<div className="comment_line" />
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
				{showEdit ? (
					<CommentEditor commentToEdit={comment} onCommentEdit={handleEdit} />
				) : (
					<div className="comment_body" id={`body${comment.id}`}></div>
				)}
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
				{showReply && (
					// <div className="comment_reply">
					// 	<div className="comment_reply_container">
					// 		<div className="comment_reply_line" />
					// 	</div>
					// 	<CommentEditor
					// 		parentId={comment.id}
					// 		parentType="comment"
					// 		onCommentAdd={onReplyAdd}
					// 		onCommentReplyCancel={onCommentReplyCancel}
					// 	/>
					// </div>
					<div
						className="comment"
						style={{
							left: "-27px",
							width: `calc(100% + 27px)`,
						}}
					>
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
			</div>
		</div>
	)
}

export default Comment
