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
			date
			thumbnail
			subreddit
			sources
			body
			type
			author {
				fullName
				id
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
	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] = useDocumentTitle("News | YorkNews")

	useEffect(() => {
		if (data) setDocumentTitle(data.news.title + " | YorkNews")

		if (data) {
			const div = document.querySelector("#body")

			div.innerHTML = data.news.body
		}
	}, [data, setDocumentTitle])

	const htmlDecode = input => {
		const e = document.createElement("div")
		e.innerHTML = input
		console.log(e)
		// console.log(e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue)
		// return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue
		return e
	}

	return (
		<Page>
			<QueryResult loading={loading} error={error} data={data}>
				<div className="news_container">
					<div className="news_header">
						<h1 className="news_header_title">{data?.news.title}</h1>

						<hr />

						<div>
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

						<div id="body"></div>

						<hr />

						<p>
							Sources:{" "}
							<a
								className="link"
								rel="noreferrer"
								target="_blank"
								href={data?.news.source}
							>
								{data?.news.source}
							</a>
						</p>
					</div>
				</div>
			</QueryResult>
		</Page>
	)
}

export default News
