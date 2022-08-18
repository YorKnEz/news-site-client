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

function CardVotes({ data, type }) {
	const client = useApolloClient()
	const [vote] = useMutation(VOTE_ITEM)
	const [votes, setVotes] = useState({
		voteState: data.voteState,
		score: data.score,
	})

	let parentType
	if (type.includes("news")) parentType = "news"
	if (type.includes("comment")) parentType = "comment"

	const handleVote = action => {
		vote({
			variables: {
				action,
				parentId: data.id,
				parentType,
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
		<div className={`votes ${type}-votes`}>
			<button className="votes_button" onClick={() => handleVote("like")}>
				{votes.voteState === "like" ? (
					<AiFillLike className="votes_icon votes_like" />
				) : (
					<AiOutlineLike className="votes_icon" />
				)}
			</button>
			<span
				className={`votes_score votes_${votes.voteState} ${type}-votes_score`}
			>
				{compressNumber(votes.score)}
			</span>
			<button className="votes_button" onClick={() => handleVote("dislike")}>
				{votes.voteState === "dislike" ? (
					<AiFillDislike className="votes_icon votes_dislike" />
				) : (
					<AiOutlineDislike className="votes_icon" />
				)}
			</button>
		</div>
	)
}

export default CardVotes
