/* eslint-disable eqeqeq */
import React, { useContext, useEffect, useState } from "react"
import {
	AiFillSave as Unsave,
	AiOutlineDelete as Delete,
	AiOutlineEdit as Edit,
	AiOutlineSave as Save,
	AiOutlineShareAlt as Share,
} from "react-icons/ai"
import { BsChatSquare } from "react-icons/bs"
import { Link, useNavigate, useParams } from "react-router-dom"

import { useApolloClient, useMutation, useQuery } from "@apollo/client"
import { formatDistance, fromUnixTime } from "date-fns"

import "./News.scss"
import {
	Button,
	CardVotes,
	DropdownList,
	Modal,
	NewsComments,
	PageWithCards,
	QueryResult,
	ThreadComments,
} from "../components"
import { UserContext } from "../context"
import { DELETE_NEWS, NEWS_BY_ID, SAVE_ITEM } from "../utils/apollo-queries"
import { useDocumentTitle } from "../utils/utils"

const ip = process.env.REACT_APP_API_IP
const port = process.env.REACT_APP_EXPRESS_API_PORT

function News() {
	const { newsId, commentId } = useParams()
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

	const goToNews = () => {
		history(`/news/${data.news.link}-${data.news.id}`)
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
							<CardVotes data={data.news} type="news" />
							<div className="news_container">
								<span className="news_posted">
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
								<div className="news_link">
									<span className="news_title">{data.news.title}</span>
									{data.news.thumbnail && (
										<img
											className="news_thumbnail"
											src={`${ip}:${port}/public/${data.news.thumbnail}`}
											alt={data.news.title}
										/>
									)}
								</div>
								{data.news.type !== "[deleted]" && (
									<>
										<div className="news_body" id="body"></div>
										<div className="sources">
											<span className="sources_title">Sources</span>
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
											<span className="tags_title">Tags</span>
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
										<div className="news_options">
											<Button
												onClick={goToNews}
												text={`${commentsCounter}`}
												Icon={BsChatSquare}
											/>
											<DropdownList>
												<Button
													onClick={handleShare}
													text="Share"
													Icon={Share}
												/>
												{saved ? (
													<Button
														onClick={handleSave}
														text="Unsave"
														Icon={Unsave}
													/>
												) : (
													<Button
														onClick={handleSave}
														text="Save"
														Icon={Save}
													/>
												)}
												{user.id == data.news.author.id && (
													<>
														<Button
															onClick={handleDelete}
															text="Delete"
															Icon={Delete}
														/>
														<Button
															onClick={handleEdit}
															text="Edit"
															Icon={Edit}
														/>
													</>
												)}
											</DropdownList>
										</div>
									</>
								)}
							</div>
						</div>
						{!commentId ? (
							<NewsComments
								commentsCounter={commentsCounter}
								setCommentsCounter={setCommentsCounter}
							/>
						) : (
							<ThreadComments
								commentsCounter={commentsCounter}
								setCommentsCounter={setCommentsCounter}
							/>
						)}
					</>
				)}
			</QueryResult>
		</PageWithCards>
	)
}

export default News
