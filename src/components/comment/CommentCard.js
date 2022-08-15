/* eslint-disable eqeqeq */
import React, { useContext, useEffect, useState } from "react"
import {
	AiFillSave,
	AiOutlineDelete,
	AiOutlineEdit,
	AiOutlineSave,
} from "react-icons/ai"
import { Link } from "react-router-dom"

import { useApolloClient, useMutation } from "@apollo/client"
import { formatDistance, fromUnixTime } from "date-fns"

import "./CommentCard.scss"
import { CommentEditor, CommentVotes } from "../../components"
import { UserContext } from "../../context"
import { REMOVE_COMMENT, SAVE_ITEM } from "../../utils/apollo-queries"

function Button({ onClick, text, Icon }) {
	return (
		<button onClick={onClick} className="comment_options_item">
			<Icon className="commentcard_options_item_icon" />
			{text}
		</button>
	)
}

function CommentCard({ data, onCommentEdit }) {
	const { news, comment } = data
	const { user } = useContext(UserContext)
	const [saved, setSaved] = useState(
		comment.saveState === "save" ? true : false
	)
	const [showEdit, setShowEdit] = useState(false)

	const client = useApolloClient()
	const [save] = useMutation(SAVE_ITEM)
	const [removeComment] = useMutation(REMOVE_COMMENT)

	useEffect(() => {
		if (comment) {
			// get the body
			const div = document.getElementById(`comm-body-${comment.id}`)

			// inject the html
			if (div) div.innerHTML = comment.body
		}
	}, [comment])

	const showDate = () => {
		const createdAt = fromUnixTime(comment.createdAt / 1000)
		const currentDate = fromUnixTime(Date.now() / 1000)
		const distance = formatDistance(createdAt, currentDate)

		return `Posted ${distance} ago`
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

	const toggleEdit = () => setShowEdit(value => !value)

	return (
		<div className="commentcard">
			<div className="commentcard_container">
				<div className="commentcard_news">
					<span className="commentcard_posted">
						<Link
							to={`/profile/${comment.author.id}/overview`}
							className="commentcard_link commentcard_link_light"
						>
							{comment.author.fullName}
						</Link>{" "}
						comment on{" "}
						<Link
							to={`/news/${news.link}-${news.id}`}
							className="commentcard_link commentcard_link_light"
						>
							{news.title}
						</Link>{" "}
						· {showDate()} by{" "}
						<Link
							to={`/profile/${news.author.id}/overview`}
							className="commentcard_link"
						>
							{news.author.fullName}
						</Link>
					</span>
				</div>
				<hr className="commentcard_separator" />
				<div className="commentcard_comment">
					<span className="commentcard_posted">
						{showDate()} by{" "}
						<Link
							to={`/profile/${comment.author.id}/overview`}
							className="commentcard_link"
						>
							{comment.author.fullName}
						</Link>
					</span>
					{showEdit && (
						<CommentEditor
							newsId={news.id}
							parentId={comment.parentId}
							parentType={comment.parentType}
							commentToEdit={comment}
							onCommentEdit={handleEdit}
							onEditorCancel={toggleEdit}
						/>
					)}
					{!showEdit && (
						<Link
							to={`/news/${news.link}-${news.id}/comment/${comment.id}`}
							className="commentcard_body"
							id={`comm-body-${comment.id}`}
						></Link>
					)}
					<div className="commentcard_options">
						<CommentVotes data={comment} />
						{saved ? (
							<Button onClick={handleSave} text="Unsave" Icon={AiFillSave} />
						) : (
							<Button onClick={handleSave} text="Save" Icon={AiOutlineSave} />
						)}
						{user.id == comment.author.id && (
							<>
								<Button
									onClick={handleDelete}
									text="Delete"
									Icon={AiOutlineDelete}
								/>
								<Button onClick={toggleEdit} text="Edit" Icon={AiOutlineEdit} />
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default CommentCard
