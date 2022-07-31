import { gql } from "@apollo/client"

// MUTATIONS

// creates a news
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

// updates a news
export const UPDATE_NEWS = gql`
	mutation UpdateNews($newsData: NewsInput!, $id: ID!) {
		updateNews(newsData: $newsData, id: $id) {
			code
			success
			message
		}
	}
`

// deletes a news
export const DELETE_NEWS = gql`
	mutation DeleteNews($id: ID!) {
		deleteNews(id: $id) {
			code
			success
			message
		}
	}
`

// like a news
export const VOTE_NEWS = gql`
	mutation VoteNews($action: String!, $id: ID!) {
		voteNews(action: $action, id: $id) {
			code
			success
			message
			likes
			dislikes
		}
	}
`

// add a comment to a news or post
export const ADD_COMMENT = gql`
	mutation AddComment($commentData: CommentInput!) {
		addComment(commentData: $commentData) {
			code
			success
			message
			comment {
				id
				parentId
				parentType
				body
				voteState
				likes
				dislikes
				replies
				createdAt
				author {
					id
					fullName
					profilePicture
				}
			}
		}
	}
`

// edit a comment
export const EDIT_COMMENT = gql`
	mutation EditComment($commentData: CommentInput!, $id: ID!) {
		editComment(commentData: $commentData, id: $id) {
			code
			success
			message
			comment {
				id
				parentId
				parentType
				body
				voteState
				likes
				dislikes
				replies
				createdAt
				author {
					id
					fullName
					profilePicture
				}
			}
		}
	}
`

// remove a comment
export const REMOVE_COMMENT = gql`
	mutation RemoveComment($id: ID!) {
		removeComment(id: $id) {
			code
			success
			message
		}
	}
`

// like a comment
export const VOTE_COMMENT = gql`
	mutation VoteComment($action: String!, $id: ID!) {
		voteComment(action: $action, id: $id) {
			code
			success
			message
			likes
			dislikes
		}
	}
`

// QUERIES

// returns news from yorknews
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
			voteState
			likes
			dislikes
			comments
			author {
				profilePicture
				fullName
				id
			}
		}
	}
`

// returns news from reddit
export const NEWS_FOR_HOME_REDDIT = gql`
	query NewsForRedditHome($after: String) {
		newsForHomeReddit(after: $after) {
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
				voteState
				likes
				dislikes
				author {
					profilePicture
					fullName
					id
				}
			}
			after
		}
	}
`

// returns news by id
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
			voteState
			likes
			dislikes
			comments
			author {
				id
				fullName
				profilePicture
			}
		}
	}
`

// returns the profile of a certain author
export const AUTHOR = gql`
	query Author($id: ID!) {
		author(id: $id) {
			id
			fullName
			email
			profilePicture
			type
			writtenNews
			followers
			createdAt
			following
		}
	}
`

// return the news of an author
export const NEWS_FOR_PROFILE = gql`
	query NewsForProfile($offsetIndex: Int, $id: ID!) {
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
			voteState
			likes
			dislikes
			comments
			author {
				profilePicture
				fullName
				id
			}
		}
	}
`

// returns news for EditNews.js
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

// returns search results
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
				voteState
				likes
				dislikes
				comments
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

// returns the authors followed by a user, paginated
export const FOLLOWED_AUTHORS = gql`
	query FollowedAuthors($offsetIndex: Int) {
		followedAuthors(offsetIndex: $offsetIndex) {
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

// returns the news a certain user liked
export const LIKED_NEWS = gql`
	query LikedNews($offsetIndex: Int) {
		likedNews(offsetIndex: $offsetIndex) {
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
			voteState
			likes
			dislikes
			author {
				id
				fullName
				profilePicture
			}
		}
	}
`

// retrieve the first comments of a news
export const COMMENTS_FOR_NEWS = gql`
	query CommentsForNews(
		$offset: Int
		$oldestCommentDate: String!
		$newsId: ID!
	) {
		commentsForNews(
			offset: $offset
			oldestCommentDate: $oldestCommentDate
			newsId: $newsId
		) {
			id
			parentId
			parentType
			body
			voteState
			likes
			dislikes
			replies
			createdAt
			author {
				id
				fullName
				profilePicture
			}
		}
	}
`

// retrieve the replies of a comment
export const COMMENT_REPLIES = gql`
	query CommentReplies(
		$offset: Int
		$oldestCommentDate: String!
		$commentId: ID!
	) {
		commentReplies(
			offset: $offset
			oldestCommentDate: $oldestCommentDate
			commentId: $commentId
		) {
			id
			parentId
			parentType
			body
			voteState
			likes
			dislikes
			replies
			createdAt
			author {
				id
				fullName
				profilePicture
			}
		}
	}
`
