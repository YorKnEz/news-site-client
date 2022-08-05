import React, { useState } from "react"
import {
	AiFillDislike,
	AiFillLike,
	AiOutlineDislike,
	AiOutlineLike,
} from "react-icons/ai"

import { useApolloClient, useMutation } from "@apollo/client"

import "./CommentVotes.scss"
import { VOTE_ITEM } from "../utils/apollo-queries"
import { compressNumber } from "../utils/utils"

function CommentVotes({ data }) {
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
				parentType: "comment",
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
		<div className="commlikes">
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
				{compressNumber(votes.score)}
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
