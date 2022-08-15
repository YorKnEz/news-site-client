/* eslint-disable eqeqeq */
import React, { useContext, useEffect, useState } from "react"
import {
	AiFillSave,
	AiOutlineDelete,
	AiOutlineEdit,
	AiOutlineSave,
	AiOutlineShareAlt,
} from "react-icons/ai"
import { BsChatSquare } from "react-icons/bs"
import { Link, useNavigate, useParams } from "react-router-dom"

import { useApolloClient, useMutation, useQuery } from "@apollo/client"
import { formatDistance, fromUnixTime } from "date-fns"

import "./News.scss"
import {
	CardVotes,
	Modal,
	NewsComments,
	PageWithCards,
	QueryResult,
} from "../components"
import { UserContext } from "../context"
import { DELETE_NEWS, NEWS_BY_ID, SAVE_ITEM } from "../utils/apollo-queries"
import { useDocumentTitle } from "../utils/utils"

function Button({ onClick, text, children }) {
	return (
		<button onClick={onClick} className="news_options_item">
			{children}
			{text}
		</button>
	)
}

function News() {
	const { newsId } = useParams()
	const history = useNavigate()

	const { user } = useContext(UserContext)
	const [sources, setSources] = useState([])
	const [tags, setTags] = useState([])
	const [commentsCounter, setCommentsCounter] = useState(0)
	const [saved, setSaved] = useState(false)
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [showShareModal, setShowShareModal] = useState(false)
	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] = useDocumentTitle("News | YorkNews")

	const client = useApolloClient()
	const { loading, error, data } = useQuery(NEWS_BY_ID, {
		variables: {
			newsId: newsId,
		},
	})
	const [deleteNews] = useMutation(DELETE_NEWS)
	const [save] = useMutation(SAVE_ITEM)

	useEffect(() => {
		if (data && data.news.type !== "[deleted]") {
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

			// set the comments counter
			setCommentsCounter(data.news.replies)

			// set the save state
			if (data.news.saveState === "save") setSaved(true)
		}
	}, [data, setDocumentTitle])

	const showDate = () => {
		const createdAt = fromUnixTime(data.news.createdAt / 1000)
		const currentDate = fromUnixTime(Date.now() / 1000)
		const distance = formatDistance(createdAt, currentDate)

		return `Posted ${distance} ago`
	}

	const onDeleteModalSubmit = async () => {
		setShowDeleteModal(false)

		deleteNews({
			variables: {
				id: data.news.id,
			},
			onCompleted: ({ deleteNews }) => {
				if (!deleteNews.success) {
					console.log(deleteNews.message)

					return
				}

				client.clearStore()

				history(-1)
			},
			onError: error => console.log({ ...error }),
		})
	}

	const onDeleteModalDecline = () => setShowDeleteModal(false)

	const onShareModalSubmit = async () => setShowShareModal(false)

	const handleDelete = () => setShowDeleteModal(true)

	const handleEdit = () =>
		history(`/news/${data.news.link}-${data.news.id}/edit`)

	const handleShare = () => setShowShareModal(true)

	const handleSave = () => {
		save({
			variables: {
				action: saved ? "unsave" : "save",
				parentId: newsId,
				parentType: "news",
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

	return (
		<PageWithCards>
			{showDeleteModal && (
				<Modal onSubmit={onDeleteModalSubmit} onDecline={onDeleteModalDecline}>
					<h3 style={{ margin: 0 }}>Delete news</h3>
					<hr />
					<p>
						Are you sure you want to delete this news? You won't be able to
						recover it afterwards.
					</p>
				</Modal>
			)}
			{showShareModal && (
				<Modal onSubmit={onShareModalSubmit}>
					<h3 style={{ margin: 0 }}>Share this with your friends</h3>
					<hr />
					<input
						className="formItem_input"
						type="text"
						value={`${window.location}`}
						readOnly
					/>
				</Modal>
			)}
			<QueryResult loading={loading} error={error} data={data}>
				{data && (
					<>
						<div className="news">
							<CardVotes data={data.news} />
							<div className="news_container">
								<span className="news_posted news_padding">
									{showDate()} by{" "}
									<Link
										to={`/profile/${
											data.news.type === "[deleted]" ? "" : data.news.author.id
										}/overview`}
										className="news_authorlink"
									>
										{data.news.author.fullName}
									</Link>
								</span>
								<div className="news_link news_padding">
									<span className="news_title">{data.news.title}</span>
									{data.news.thumbnail && (
										<img
											className="news_thumbnail"
											src={data.news.thumbnail}
											alt={data.news.title}
										/>
									)}
								</div>
								{data.news.type !== "[deleted]" && (
									<>
										<div className="news_body news_padding" id="body"></div>
										<div className="sources news_padding">
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
										<div className="tags news_padding">
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
										<div className="news_options news_padding">
											<Link
												to={`/news/${data.news.link}-${data.news.id}`}
												className="news_options_item"
											>
												<BsChatSquare className="news_options_item_icon" />
												{commentsCounter}
											</Link>
											<Button onClick={handleShare} text="Share">
												<AiOutlineShareAlt className="news_options_item_icon" />
											</Button>
											{saved ? (
												<Button onClick={handleSave} text="Unsave">
													<AiFillSave className="news_options_item_icon" />
												</Button>
											) : (
												<Button onClick={handleSave} text="Save">
													<AiOutlineSave className="news_options_item_icon" />
												</Button>
											)}
											{user.id == data.news.author.id && (
												<>
													<Button onClick={handleDelete} text="Delete">
														<AiOutlineDelete className="news_options_item_icon" />
													</Button>
													<Button onClick={handleEdit} text="Edit">
														<AiOutlineEdit className="news_options_item_icon" />
													</Button>
												</>
											)}
										</div>
									</>
								)}
							</div>
						</div>
						<NewsComments
							newsId={newsId}
							commentsCounter={commentsCounter}
							setCommentsCounter={setCommentsCounter}
						/>
					</>
				)}
			</QueryResult>
		</PageWithCards>
	)
}

export default News
