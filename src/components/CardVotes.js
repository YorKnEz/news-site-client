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
		score: data.score,
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
					score: vote.score,
				})
			},
			onError: error => console.log({ ...error }),
		})
	}

	return (
		<div className="cardvotes">
			<button className="cardvotes_button" onClick={e => handleVote(e, "like")}>
				{votes.voteState === "like" ? (
					<AiFillLike className="cardvotes_icon cardvotes_like" />
				) : (
					<AiOutlineLike className="cardvotes_icon" />
				)}
			</button>
			<span className={`cardvotes_${votes.voteState}`}>
				{compressNumber(votes.score)}
			</span>
			<button
				className="cardvotes_button"
				onClick={e => handleVote(e, "dislike")}
			>
				{votes.voteState === "dislike" ? (
					<AiFillDislike className="cardvotes_icon cardvotes_dislike" />
				) : (
					<AiOutlineDislike className="cardvotes_icon" />
				)}
			</button>
		</div>
	)
}

export default CardVotes
