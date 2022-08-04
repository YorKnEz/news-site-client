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

function CardVotes({ data }) {
	const client = useApolloClient()
	const [voteNews] = useMutation(VOTE_NEWS)
	const [votes, setVotes] = useState({
		voteState: data.voteState,
		likes: data.likes,
		dislikes: data.dislikes,
	})

	const handleVote = (e, action) => {
		e.preventDefault()

		voteNews({
			variables: {
				action,
				id: data.id,
			},
			onCompleted: ({ voteNews }) => {
				if (!voteNews.success) {
					console.log(voteNews.message)

					return
				}

				client.clearStore()

				setVotes({
					voteState: action === votes.voteState ? "none" : action,
					likes: voteNews.likes,
					dislikes: voteNews.dislikes,
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
