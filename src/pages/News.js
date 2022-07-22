/* eslint-disable eqeqeq */
import React, { useContext, useEffect, useState } from "react"
import {
	AiOutlineEdit,
	AiOutlineDelete,
	AiOutlineLike,
	AiFillLike,
	AiFillDislike,
	AiOutlineDislike,
} from "react-icons/ai"
import { useNavigate, useParams } from "react-router"
import { Link } from "react-router-dom"

import { useQuery, useMutation, useApolloClient } from "@apollo/client"
import { format, fromUnixTime } from "date-fns"

import "./News.scss"
import { AuthorInfo, Modal, Page, QueryResult } from "../components"
import { UserContext } from "../context"
import { NEWS2, DELETE_NEWS, LIKE_NEWS } from "../utils/apollo-queries"
import { useDocumentTitle } from "../utils/utils"

function News() {
	const client = useApolloClient()
	const { newsId } = useParams()
	const { loading, error, data } = useQuery(NEWS2, {
		variables: {
			newsId: newsId,
		},
	})
	const [deleteNews] = useMutation(DELETE_NEWS)
	const [likeNews] = useMutation(LIKE_NEWS)
	const { user } = useContext(UserContext)
	const history = useNavigate()
	const [likes, setLikes] = useState({
		likeState: "none",
		likes: 0,
		dislikes: 0,
	})
	const [sources, setSources] = useState([])
	const [tags, setTags] = useState([])
	const [showModal, setShowModal] = useState(false)
	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] = useDocumentTitle("News | YorkNews")

	useEffect(() => {
		if (data) {
			console.log(data)

			// update the title of the page
			setDocumentTitle(data.news.title + " | YorkNews")

			// get the body
			const div = document.querySelector("#body")

			// inject the html
			div.innerHTML = data.news.body

			// set the sources
			setSources(data.news.sources.split(","))

			// set the tags
			if (data.news.tags.length > 0) setTags(data.news.tags.split(","))

			// set the likes, dislikes and likeState
			setLikes({
				likeState: data.news.likeState,
				likes: data.news.likes,
				dislikes: data.news.dislikes,
			})
		}
	}, [data, setDocumentTitle])

	const getDate = () => {
		const updatedAt = fromUnixTime(data.news.updatedAt / 1000)

		return format(updatedAt, "MMMM d',' yyyy H':'mm")
	}

	const onModalSubmit = async () => {
		setShowModal(false)

		deleteNews({
			variables: {
				id: data.news.id,
			},
			onCompleted: data => {
				console.log(data)

				client.clearStore()

				history(-1)
			},
		})
	}

	const onModalDecline = () => {
		setShowModal(false)
	}

	const handleDelete = e => {
		e.preventDefault()

		setShowModal(true)
	}

	const handleEdit = e => {
		e.preventDefault()

		history(`/news/${data.news.id}/edit`)
	}

	const handleLike = (e, action) => {
		e.preventDefault()

		likeNews({
			variables: {
				action,
				id: data.news.id,
			},
			onCompleted: ({ likeNews }) => {
				console.log(likeNews)

				setLikes({
					likeState: action === likes.likeState ? "none" : action,
					likes: likeNews.likes,
					dislikes: likeNews.dislikes,
				})

				client.clearStore()
			},
		})
	}

	return (
		<Page>
			{showModal && (
				<Modal onSubmit={onModalSubmit} onDecline={onModalDecline}>
					<h3 style={{ margin: 0 }}>Delete news</h3>
					<hr />
					<p>
						Are you sure you want to delete this news? You won't be able to
						recover it afterwards.
					</p>
				</Modal>
			)}
			<QueryResult loading={loading} error={error} data={data}>
				{data && (
					<div className="news">
						<div className="news_likes">
							<div className="news_likes_row">
								<span
									style={{
										color:
											likes.likeState === "like"
												? "var(--button-color)"
												: "var(--text-color)",
									}}
								>
									{likes.likes}
								</span>
								<button onClick={e => handleLike(e, "like")}>
									{likes.likeState === "like" ? (
										<AiFillLike style={{ color: "var(--button-color)" }} />
									) : (
										<AiOutlineLike />
									)}
								</button>
							</div>
							<div className="news_likes_row">
								<span
									style={{
										color:
											likes.likeState === "dislike"
												? "red"
												: "var(--text-color)",
									}}
								>
									{likes.dislikes}
								</span>
								<button onClick={e => handleLike(e, "dislike")}>
									{likes.likeState === "dislike" ? (
										<AiFillDislike style={{ color: "red" }} />
									) : (
										<AiOutlineDislike />
									)}
								</button>
							</div>
						</div>
						<h1 className="news_title">{data.news.title}</h1>
						{user.id == data.news.author.id && (
							<div className="news_buttons">
								<button
									onClick={handleDelete}
									className="button button_primary news_buttons_delete"
								>
									<AiOutlineDelete />
								</button>
								<button
									onClick={handleEdit}
									className="button button_primary news_buttons_edit"
								>
									<AiOutlineEdit />
								</button>
							</div>
						)}

						<hr />

						<div className="news_info">
							<AuthorInfo
								data={data.news.author}
								type={data.news.type}
								subreddit={data.news.subreddit}
								link
							/>

							<p>Last edited on: {getDate()}</p>
						</div>

						<hr />

						<img
							className="news_thumbnail"
							src={data.news.thumbnail}
							alt="thumbnail"
						/>

						<hr />

						<div className="news_body" id="body"></div>

						<hr />

						<div className="sources">
							<h4>Sources</h4>
							{sources.map(s => (
								<a
									className="sources_item"
									key={s}
									href={s}
									target="_blank"
									rel="noreferrer"
								>
									{s}
								</a>
							))}
						</div>
						<div className="tags">
							<h4>Tags</h4>
							{tags.length > 0 &&
								tags.map(s => (
									<Link
										className="tags_item"
										key={s}
										to={`/search?search=${s}&filter=tags`}
									>
										{s}
									</Link>
								))}
						</div>
					</div>
				)}
			</QueryResult>
		</Page>
	)
}

export default News
