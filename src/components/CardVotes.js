import React, { useState } from "react"
import {
	AiFillDislike,
	AiFillLike,
	AiOutlineDislike,
	AiOutlineLike,
} from "react-icons/ai"

import { useApolloClient, useMutation } from "@apollo/client"

import "./CardVotes.scss"
import { VOTE_NEWS } from "../utils/apollo-queries"
import { compressNumber } from "../utils/utils"
import Modal from "./Modal"

function CardVotes({ data }) {
	const client = useApolloClient()
	const [voteNews] = useMutation(VOTE_NEWS)
	const [votes, setVotes] = useState({
		voteState: data.voteState,
		likes: data.likes,
		dislikes: data.dislikes,
	})
	const [error, setError] = useState("")

	const handleVote = (e, action) => {
		e.preventDefault()

		voteNews({
			variables: {
				action,
				id: data.id,
			},
			onCompleted: ({ voteNews }) => {
				console.log(voteNews)

				setVotes({
					voteState: action === votes.voteState ? "none" : action,
					likes: voteNews.likes,
					dislikes: voteNews.dislikes,
				})

				client.clearStore()
			},
			onError: error =>
				setError(error?.response?.data.message || error.message),
		})
	}

	return (
		<div className="likes">
			{error && (
				<Modal onSubmit={() => setError("")}>
					<p>{error}</p>
				</Modal>
			)}
			<button className="likes_button" onClick={e => handleVote(e, "like")}>
				{votes.voteState === "like" ? (
					<AiFillLike
						className="likes_icon"
						style={{ color: "var(--primary-color)" }}
					/>
				) : (
					<AiOutlineLike className="likes_icon" />
				)}
			</button>
			<span
				style={{
					color:
						votes.voteState === "like"
							? "var(--primary-color)"
							: votes.voteState === "dislike"
							? "red"
							: "var(--text-color)",
				}}
			>
				{compressNumber(votes.likes - votes.dislikes)}
			</span>
			<button className="likes_button" onClick={e => handleVote(e, "dislike")}>
				{votes.voteState === "dislike" ? (
					<AiFillDislike className="likes_icon" style={{ color: "red" }} />
				) : (
					<AiOutlineDislike className="likes_icon" />
				)}
			</button>
		</div>
	)
}

export default CardVotes
