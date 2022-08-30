import { gql } from "@apollo/client"

// MUTATIONS

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
				score
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
				score
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
				score
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

// like a comment
export const VOTE_ITEM = gql`
	mutation Vote($action: String!, $parentId: ID!, $parentType: String!) {
		vote(action: $action, parentId: $parentId, parentType: $parentType) {
			code
			success
			message
			score
		}
	}
`

export const SAVE_ITEM = gql`
	mutation Save($action: String!, $parentId: ID!, $parentType: String!) {
		save(action: $action, parentId: $parentId, parentType: $parentType) {
			code
			success
			message
		}
	}
`

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

export const FOLLOW_AUTHOR = gql`
	mutation FollowAuthor($action: String!, $id: ID!) {
		follow(action: $action, id: $id) {
			code
			success
			message
		}
	}
`

// QUERIES

// retrieve the first comments of a news
export const COMMENTS_FOR_NEWS = gql`
	query CommentsForNews($oldestId: ID!, $newsId: ID!, $sortBy: String!) {
		commentsForNews(oldestId: $oldestId, newsId: $newsId, sortBy: $sortBy) {
			id
			parentId
			parentType
			body
			voteState
			likes
			dislikes
			score
			replies
			createdAt
			saveState
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
	query CommentReplies($oldestId: ID!, $commentId: ID!, $sortBy: String!) {
		commentReplies(
			oldestId: $oldestId
			commentId: $commentId
			sortBy: $sortBy
		) {
			id
			parentId
			parentType
			body
			voteState
			likes
			dislikes
			score
			replies
			createdAt
			saveState
			author {
				id
				fullName
				profilePicture
			}
		}
	}
`

export const COMMENT_FOR_THREAD = gql`
	query CommendById($depth: Int!, $commentId: ID!) {
		commentById(commentId: $commentId) {
			id
			parentId
			parentType
			body
			voteState
			likes
			dislikes
			score
			replies
			createdAt
			saveState
			author {
				id
				fullName
				profilePicture
			}
		}
		commentNthParentId(depth: $depth, commentId: $commentId)
	}
`

// returns the news and comments a certain user liked
export const LIKED_ITEMS = gql`
	query Liked($oldestId: ID!, $oldestType: String!, $userId: ID!) {
		liked(oldestId: $oldestId, oldestType: $oldestType, userId: $userId) {
			__typename
			... on News {
				id
				title
				subreddit
				thumbnail
				sources
				tags
				body
				type
				createdAt
				voteState
				likes
				dislikes
				score
				replies
				saveState
				link
				author {
					profilePicture
					fullName
					id
				}
			}
			... on CommentCard {
				comment {
					id
					parentId
					parentType
					body
					voteState
					likes
					dislikes
					score
					replies
					createdAt
					saveState
					author {
						id
						fullName
						profilePicture
					}
				}
				news {
					id
					title
					type
					link
					author {
						id
						fullName
						profilePicture
					}
				}
			}
		}
	}
`

// returns the news and comments a certain user liked
export const SAVED_ITEMS = gql`
	query Saved($oldestId: ID!, $oldestType: String!, $userId: ID!) {
		saved(oldestId: $oldestId, oldestType: $oldestType, userId: $userId) {
			__typename
			... on News {
				id
				title
				subreddit
				thumbnail
				sources
				tags
				body
				type
				createdAt
				voteState
				likes
				dislikes
				score
				replies
				saveState
				link
				author {
					profilePicture
					fullName
					id
				}
			}
			... on CommentCard {
				comment {
					id
					parentId
					parentType
					body
					voteState
					likes
					dislikes
					score
					replies
					createdAt
					saveState
					author {
						id
						fullName
						profilePicture
					}
				}
				news {
					id
					title
					type
					link
					author {
						id
						fullName
						profilePicture
					}
				}
			}
		}
	}
`

// returns news from yorknews
export const NEWS_FOR_HOME = gql`
	query NewsForHome($oldestId: ID!, $sortBy: String!, $followed: Boolean) {
		newsForHome(oldestId: $oldestId, sortBy: $sortBy, followed: $followed) {
			id
			title
			subreddit
			thumbnail
			sources
			tags
			body
			type
			createdAt
			voteState
			likes
			dislikes
			score
			replies
			saveState
			link
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
				voteState
				likes
				dislikes
				score
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
			voteState
			likes
			dislikes
			score
			replies
			saveState
			link
			author {
				profilePicture
				fullName
				id
			}
		}
	}
`

// returns news by id
export const NEWS_BY_ID = gql`
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
			voteState
			likes
			dislikes
			score
			replies
			saveState
			link
			author {
				profilePicture
				fullName
				id
			}
		}
	}
`

// returns news for EditNews.js
export const NEWS_TO_EDIT = gql`
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

export const NEWS_FOR_PROFILE_CARD = gql`
	query NewsForProfileCard(
		$id: ID
		$newsId: ID
		$howManyBest: Int!
		$howManyRecent: Int!
	) {
		newsForProfileCard(
			id: $id
			newsId: $newsId
			howManyBest: $howManyBest
			howManyRecent: $howManyRecent
		) {
			best {
				id
				title
				thumbnail
				sources
				tags
				body
				type
				createdAt
				score
				replies
				link
				author {
					fullName
				}
			}
			recent {
				id
				title
				thumbnail
				sources
				tags
				body
				type
				createdAt
				score
				replies
				link
				author {
					fullName
				}
			}
		}
	}
`

// returns search results
export const SEARCH = gql`
	query Query($search: String!, $filter: String!, $fetchedResults: Int!) {
		search(search: $search, filter: $filter, fetchedResults: $fetchedResults) {
			id
			title
			subreddit
			thumbnail
			sources
			tags
			body
			type
			createdAt
			voteState
			likes
			dislikes
			score
			replies
			saveState
			link
			author {
				profilePicture
				fullName
				id
			}
		}
	}
`

// returns the profile of a certain user
export const USER = gql`
	query User($id: ID!) {
		user(id: $id) {
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

// returns the authors followed by a user, paginated
export const FOLLOWED_AUTHORS = gql`
	query FollowedAuthors($offset: Int) {
		followedAuthors(offset: $offset) {
			id
			type
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

export const BEST_AUTHORS = gql`
	query BestAuthors {
		bestAuthors {
			id
			fullName
			profilePicture
			following
		}
	}
`
