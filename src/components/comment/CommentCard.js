/* eslint-disable eqeqeq */
import React, { useContext, useEffect, useState } from "react"
import {
	AiFillSave as Unsave,
	AiOutlineSave as Save,
	AiOutlineDelete as Delete,
	AiOutlineEdit as Edit,
} from "react-icons/ai"
import { Link } from "react-router-dom"

import { useApolloClient, useMutation } from "@apollo/client"
import { formatDistance, fromUnixTime } from "date-fns"

import "./CommentCard.scss"
import {
	Button,
	CommentEditor,
	CardVotes,
	DropdownList,
} from "../../components"
import { UserContext } from "../../context"
import { REMOVE_COMMENT, SAVE_ITEM } from "../../utils/apollo-queries"

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
						<CardVotes data={comment} type="comment" />
						<DropdownList>
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
				</div>
			</div>
		</div>
	)
}

export default CommentCard
