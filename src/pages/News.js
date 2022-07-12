/* eslint-disable eqeqeq */
import { useQuery, gql } from "@apollo/client"
import { format, fromUnixTime } from "date-fns"
import React, { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai"
import axios from "axios"

import "./News.scss"
import { useDocumentTitle } from "../utils"
import { AuthorInfo, Modal, Page, QueryResult } from "../components"
import { UserContext } from "../context"

const ip = process.env.REACT_APP_EXPRESS_API_IP

const NEWS = gql`
	query News($newsId: ID!) {
		news(id: $newsId) {
			id
			title
			subreddit
			thumbnail
			sources
			tags
			body
			type
			createdAt
			updatedAt
			author {
				id
				fullName
				profilePicture
			}
		}
	}
`

function News() {
	const { newsId } = useParams()
	const { loading, error, data } = useQuery(NEWS, {
		variables: {
			newsId: newsId,
		},
	})
	const { user, token } = useContext(UserContext)
	const history = useNavigate()
	const [sources, setSources] = useState([])
	const [tags, setTags] = useState([])
	const [showModal, setShowModal] = useState(false)
	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] = useDocumentTitle("News | YorkNews")

	useEffect(() => {
		if (data) {
			setDocumentTitle(data.news.title + " | YorkNews")

			const div = document.querySelector("#body")

			div.innerHTML = data.news.body

			setSources(data.news.sources.split(","))
			setTags(data.news.tags.split(","))
		}
	}, [data, setDocumentTitle])

	const getDate = () => {
		const updatedAt = fromUnixTime(data.news.updatedAt / 1000)

		return format(updatedAt, "MMMM d',' yyyy H':'mm")
	}

	const onModalSubmit = async () => {
		setShowModal(false)

		// handle news deletion
		await axios({
			method: "delete",
			url: `${ip}/news/delete`,
			data: data.news,
			headers: {
				authorization: token,
			},
		})
			.then(res => {
				console.log(res)

				history("../profile")
			})
			.catch(e => console.log(e?.response?.data?.error || e.message))
	}

	const onModalDecline = () => {
		setShowModal(false)
	}

	const handleDelete = () => {
		setShowModal(true)
	}

	const handleEdit = e => {
		history(`/news/${data.news.id}/edit`)
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
					<div className="news_container">
						<h1 className="news_title">{data.news.title}</h1>
						{user.id == data.news.author.id && (
							<div className="news_buttons">
								<button onClick={handleDelete} className="news_buttons_delete">
									<AiOutlineDelete size={16} />
								</button>
								<button onClick={handleEdit} className="news_buttons_edit">
									<AiOutlineEdit size={16} />
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

						<div id="body"></div>

						<hr />

						<div className="sources">
							<h4>Sources</h4>
							{sources.map(s => (
								<a className="sources_item" key={s} href={s}>
									{s}
								</a>
							))}
						</div>
						<div className="tags">
							<h4>Tags</h4>
							{tags.map(s => (
								<a className="tags_item" key={s} href={s}>
									{s}
								</a>
							))}
						</div>
					</div>
				)}
			</QueryResult>
		</Page>
	)
}

export default News
