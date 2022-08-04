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

// udpate the comments counter of a news
export const UPDATE_COMMENTS_COUNTER = gql`
	mutation UpdateCommentsCounter($action: String!, $id: ID!) {
		updateCommentsCounter(action: $action, id: $id) {
			code
			success
			message
			comments
		}
	}
`

// save a news
export const SAVE_NEWS = gql`
	mutation SaveNews($action: String!, $id: ID!) {
		saveNews(action: $action, id: $id) {
			code
			success
			message
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

// udpate the replies counter of a comment
export const UPDATE_REPLIES_COUNTER = gql`
	mutation UpdateRepliesCounter($action: String!, $id: ID!) {
		updateRepliesCounter(action: $action, id: $id) {
			code
			success
			message
			replies
		}
	}
`

// like a comment
export const VOTE_ITEM = gql`
	mutation Vote($action: String!, $parentId: ID!, $parentType: String!) {
		vote(action: $action, parentId: $parentId, parentType: $parentType) {
			code
			success
			message
			likes
			dislikes
		}
	}
`

export const SAVE_COMMENT = gql`
	mutation SaveComment($action: String!, $id: ID!) {
		saveComment(action: $action, id: $id) {
			code
			success
			message
		}
	}
`

// QUERIES

// returns news from yorknews
export const NEWS_FOR_HOME = gql`
	query NewsForHome($oldestId: ID!) {
		newsForHome(oldestId: $oldestId) {
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
			saveState
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
			saveState
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
	query NewsForProfile($oldestId: ID!, $id: ID!) {
		newsForProfile(oldestId: $oldestId, id: $id) {
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
			saveState
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
				saveState
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
	query FollowedAuthors($offset: Int) {
		followedAuthors(offset: $offset) {
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
	query LikedNews($oldestId: ID!) {
		likedNews(oldestId: $oldestId) {
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
			saveState
			author {
				id
				fullName
				profilePicture
			}
		}
	}
`

// returns the news a certain user saved
export const SAVED_NEWS = gql`
	query SavedNews($oldestId: ID!) {
		savedNews(oldestId: $oldestId) {
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
			saveState
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
	query CommentsForNews($oldestCommentDate: String!, $newsId: ID!) {
		commentsForNews(oldestCommentDate: $oldestCommentDate, newsId: $newsId) {
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
	query CommentReplies($oldestCommentDate: String!, $commentId: ID!) {
		commentReplies(
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
