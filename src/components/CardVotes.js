import React, { useState } from "react"
import {
	AiFillDislike,
	AiFillLike,
	AiOutlineDislike,
	AiOutlineLike,
} from "react-icons/ai"

import { useApolloClient, useMutation } from "@apollo/client"

import "./CardVotes.scss"
import { VOTE_ITEM } from "../utils/apollo-queries"
import { compressNumber } from "../utils/utils"

function CardVotes({ data }) {
	const client = useApolloClient()
	const [vote] = useMutation(VOTE_ITEM)
	const [votes, setVotes] = useState({
		voteState: data.voteState,
		likes: data.likes,
		dislikes: data.dislikes,
	})

	const handleVote = (e, action) => {
		e.preventDefault()

		vote({
			variables: {
				action,
				parentId: data.id,
				parentType: "news",
			},
			onCompleted: ({ vote }) => {
				if (!vote.success) {
					console.log(vote.message)

					return
				}

				client.clearStore()

				setVotes({
					voteState: action === votes.voteState ? "none" : action,
					likes: vote.likes,
					dislikes: vote.dislikes,
				})
			},
			onError: error => console.log({ ...error }),
		})
	}

	return (
		<div className="cardlikes">
			<button className="cardlikes_button" onClick={e => handleVote(e, "like")}>
				{votes.voteState === "like" ? (
					<AiFillLike
						className="cardlikes_icon"
						style={{ color: "var(--primary-color)" }}
					/>
				) : (
					<AiOutlineLike className="cardlikes_icon" />
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
			<button
				className="cardlikes_button"
				onClick={e => handleVote(e, "dislike")}
			>
				{votes.voteState === "dislike" ? (
					<AiFillDislike className="cardlikes_icon" style={{ color: "red" }} />
				) : (
					<AiOutlineDislike className="cardlikes_icon" />
				)}
			</button>
		</div>
	)
}

export default CardVotes
