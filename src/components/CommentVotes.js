import React, { useState } from "react"
import {
	AiFillDislike,
	AiFillLike,
	AiOutlineDislike,
	AiOutlineLike,
} from "react-icons/ai"

import { useApolloClient, useMutation } from "@apollo/client"

import "./CommentVotes.scss"
import { Modal } from "../components"
import { VOTE_COMMENT } from "../utils/apollo-queries"
import { compressNumber } from "../utils/utils"

function CommentVotes({ data }) {
	const client = useApolloClient()
	const [voteComment] = useMutation(VOTE_COMMENT)
	const [votes, setVotes] = useState({
		voteState: data.voteState,
		likes: data.likes,
		dislikes: data.dislikes,
	})
	const [error, setError] = useState("")

	const handleVote = (e, action) => {
		e.preventDefault()

		voteComment({
			variables: {
				action,
				id: data.id,
			},
			onCompleted: ({ voteComment }) => {
				console.log(voteComment)

				setVotes({
					voteState: action === votes.voteState ? "none" : action,
					likes: voteComment.likes,
					dislikes: voteComment.dislikes,
				})

				client.clearStore()
			},
			onError: error =>
				setError(error?.response?.data.message || error.message),
		})
	}

	return (
		<div className="commlikes">
			{error && (
				<Modal onSubmit={() => setError("")}>
					<p>{error}</p>
				</Modal>
			)}
			<button className="commlikes_button" onClick={e => handleVote(e, "like")}>
				{votes.voteState === "like" ? (
					<AiFillLike
						className="commlikes_icon"
						style={{ color: "var(--primary-color)" }}
					/>
				) : (
					<AiOutlineLike className="commlikes_icon" />
				)}
			</button>
			<span
				className="commlikes_number"
				style={{
					color:
						votes.voteState === "like"
							? "var(--primary-color)"
							: votes.voteState === "dislike"
							? "red"
							: "var(--secondText-color)",
				}}
			>
				{compressNumber(votes.likes - votes.dislikes)}
			</span>
			<button
				className="commlikes_button"
				onClick={e => handleVote(e, "dislike")}
			>
				{votes.voteState === "dislike" ? (
					<AiFillDislike className="commlikes_icon" style={{ color: "red" }} />
				) : (
					<AiOutlineDislike className="commlikes_icon" />
				)}
			</button>
		</div>
	)
}

export default CommentVotes
