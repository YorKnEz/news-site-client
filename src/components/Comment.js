/* eslint-disable eqeqeq */
import React, { useContext, useEffect, useState } from "react"
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"
import { Link } from "react-router-dom"

import { useApolloClient, useMutation } from "@apollo/client"
import { formatDistance, fromUnixTime } from "date-fns"

import "./Comment.scss"
import { CommentEditor, CommentVotes } from "../components"
import { UserContext } from "../context"
import { REMOVE_COMMENT } from "../utils/apollo-queries"

function Comment({ comment, onCommentRemove, onCommentEdit }) {
	const client = useApolloClient()
	const { user } = useContext(UserContext)
	const [removeComment] = useMutation(REMOVE_COMMENT)
	const [showEdit, setShowEdit] = useState(false)

	const showDate = () => {
		const createdAt = fromUnixTime(data.createdAt / 1000)
		const currentDate = fromUnixTime(Date.now() / 1000)
		const distance = formatDistance(createdAt, currentDate)

		return `  -  Posted ${distance} ago`
	}

	useEffect(() => {
		if (data) {
			// get the body
			const div = document.getElementById(`body${data.id}`)

			// inject the html
			div.innerHTML = data.body
		}
	}, [data])

	const handleDelete = e => {
		e.preventDefault()

		removeComment({
			variables: {
				id: parseInt(data.id),
			},
			onCompleted: res => {
				console.log(res)

				client.clearStore()
				onCommentRemove(data.id)
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
							data.author.profilePicture !== "default"
								? data.author.profilePicture
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
							to={`/profile/${data.author.id}`}
							className="comment_posted_author_link"
						>
							{data.author.fullName}
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
					<CommentVotes data={data} />
					{user.id == data.author.id && (
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
			</div>
		</div>
	)
}

export default Comment
