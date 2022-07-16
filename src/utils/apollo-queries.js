import { gql } from "@apollo/client"

export const NEWS = gql`
	query News($newsId: ID!) {
		news(id: $newsId) {
			id
			title
			thumbnail
			sources
			tags
			body
			author {
				id
			}
		}
	}
`

export const NEWS_FOR_HOME = gql`
	query NewsForHome($offsetIndex: Int) {
		newsForHome(offsetIndex: $offsetIndex) {
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
				profilePicture
				fullName
				id
			}
		}
	}
`

export const NEWS_FOR_REDDIT_HOME = gql`
	query NewsForRedditHome($offsetIndex: Int) {
		newsForRedditHome(offsetIndex: $offsetIndex) {
			id
			title
			subreddit
			thumbnail
			sources
			tags
			body
			type
			author {
				id
				fullName
				profilePicture
			}
		}
	}
`

export const NEWS2 = gql`
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

export const CREATE_NEWS = gql`
	mutation CreateNews($newsData: NewsInput!) {
		createNews(newsData: $newsData) {
			code
			success
			message
			id
		}
	}
`

export const DELETE_NEWS = gql`
	mutation DeleteNews($id: ID!) {
		deleteNews(id: $id) {
			code
			success
			message
		}
	}
`

export const SEARCH = gql`
	query Query($search: String!, $filter: String!) {
		search(search: $search, filter: $filter) {
			matches
			news {
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
			author {
				id
				fullName
				email
				profilePicture
				writtenNews
				followers
				createdAt
				following
			}
		}
	}
`

export const AUTHOR = gql`
	query Query($offsetIndex: Int, $id: ID!, $reqId: ID!) {
		newsForProfile(offsetIndex: $offsetIndex, id: $id) {
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
		}
		author(id: $id, reqId: $reqId) {
			id
			fullName
			email
			profilePicture
			writtenNews
			followers
			createdAt
			following
		}
	}
`
