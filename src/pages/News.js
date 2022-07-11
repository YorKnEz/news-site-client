import { useQuery, gql } from "@apollo/client"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router"
import { AuthorInfo, Page, QueryResult } from "../components"
import { useDocumentTitle } from "../utils"

import "./News.scss"

const NEWS = gql`
	query News($newsId: ID!) {
		news(id: $newsId) {
			id
			title
			subreddit
			thumbnail
			date
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
	const [sources, setSources] = useState([])
	const [tags, setTags] = useState([])
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

	return (
		<Page>
			<QueryResult loading={loading} error={error} data={data}>
				<div className="news_container">
					<div className="news_header">
						<h1 className="news_header_title">{data?.news.title}</h1>

						<hr />

						<div className="news_info">
							<AuthorInfo
								fullName={data?.news.author.fullName}
								profilePicture={data?.news.author.profilePicture}
								type={data?.news.type}
								subreddit={data?.news.subreddit}
							/>

							<p>Last edited on: {data?.news.date}</p>
						</div>
						<hr />

						<img
							className="news_thumbnail"
							src={data?.news.thumbnail}
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
				</div>
			</QueryResult>
		</Page>
	)
}

export default News
