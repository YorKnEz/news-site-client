/* eslint-disable eqeqeq */
import React, { useContext, useEffect, useState } from "react"
import {
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
	Page,
	QueryResult,
} from "../components"
import { UserContext } from "../context"
import { DELETE_NEWS, NEWS2 } from "../utils/apollo-queries"
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
	const { user } = useContext(UserContext)
	const history = useNavigate()
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
		}
	}, [data, setDocumentTitle])

	const showDate = () => {
		const createdAt = fromUnixTime(data.news.createdAt / 1000)
		const currentDate = fromUnixTime(Date.now() / 1000)
		const distance = formatDistance(createdAt, currentDate)

		return `Posted ${distance} ago`
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

	const handleShare = e => {}

	const handleSave = e => {}

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
					<>
						<div className="news">
							<CardVotes data={data.news} />
							<div className="news_container">
								<span className="news_posted news_padding">
									{showDate()} by{" "}
									<Link
										to={`/profile/${data.news.author.id}`}
										className="news_authorlink"
									>
										{data.news.author.fullName}
									</Link>
								</span>
								<Link
									to={`/news/${data.news.id}`}
									className="news_link news_padding"
								>
									<span className="news_title">{data.news.title}</span>
									<img
										className="news_thumbnail"
										src={data.news.thumbnail}
										alt={data.news.title}
									/>
								</Link>
								<div className="news_body news_padding" id="body"></div>
								{/* <div className="news_tags">{showTags()}</div> */}
								<div className="news_sources news_padding">
									<h4>Sources</h4>
									{sources.map(s => (
										<a
											className="news_sources_item"
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
										to={`/news/${data.news.id}`}
										className="news_options_item"
									>
										<BsChatSquare className="news_options_item_icon" />
										{data.news.comments}
									</Link>
									<button onClick={handleShare} className="news_options_item">
										<AiOutlineShareAlt className="news_options_item_icon" />
										Share
									</button>
									<button onClick={handleSave} className="news_options_item">
										<AiOutlineSave className="news_options_item_icon" />
										Save
									</button>
									{user.id == data.news.author.id && (
										<>
											<button
												onClick={handleDelete}
												className="news_options_item"
											>
												<AiOutlineDelete className="news_options_item_icon" />
												Delete
											</button>
											<button
												onClick={handleEdit}
												className="news_options_item"
											>
												<AiOutlineEdit className="news_options_item_icon" />
												Edit
											</button>
										</>
									)}
								</div>
							</div>
						</div>
						<NewsComments />
					</>
				)}
			</QueryResult>
		</Page>
	)
}

export default News
