import React, { useContext, useEffect, useState } from "react"
import { Editor } from "react-draft-wysiwyg"
import { convertToRaw, EditorState } from "draft-js"
import draftToHtml from "draftjs-to-html"
import { Link } from "react-router-dom"

import { useApolloClient, useMutation, useQuery } from "@apollo/client"

import "./NewsComments.scss"
import { Comment } from "../components"
import { UserContext } from "../context"
import { ADD_COMMENT, COMMENTS_FOR_NEWS } from "../utils/apollo-queries"
import QueryResult from "./QueryResult"

const editorOptions = {
	options: [
		"inline",
		"blockType",
		// "fontSize",
		// "fontFamily",
		"list",
		// "textAlign",
		// "colorPicker",
		"link",
		"embedded",
		// "emoji",
		// "image",
		// "remove",
		// "history",
	],
	inline: {
		// inDropdown: false,
		// className: undefined,
		// component: undefined,
		// dropdownClassName: undefined,
		options: [
			"bold",
			"italic",
			"underline",
			"strikethrough",
			// "monospace",
			// "superscript",
			// "subscript",
		],
		// bold: { icon: bold, className: undefined },
		// italic: { icon: italic, className: undefined },
		// underline: { icon: underline, className: undefined },
		// strikethrough: { icon: strikethrough, className: undefined },
		// monospace: { icon: monospace, className: undefined },
		// superscript: { icon: superscript, className: undefined },
		// subscript: { icon: subscript, className: undefined },
	},
	blockType: {
		// inDropdown: true,
		options: [
			// "Normal",
			// "H1",
			// "H2",
			// "H3",
			// "H4",
			// "H5",
			// "H6",
			"Blockquote",
			"Code",
		],
		// className: undefined,
		// component: undefined,
		// dropdownClassName: undefined,
	},
	fontSize: {
		// icon: fontSize,
		options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
		// className: undefined,
		// component: undefined,
		// dropdownClassName: undefined,
	},
	fontFamily: {
		options: [
			"Arial",
			"Georgia",
			"Impact",
			"Tahoma",
			"Times New Roman",
			"Verdana",
		],
		// className: undefined,
		// component: undefined,
		// dropdownClassName: undefined,
	},
	list: {
		// inDropdown: false,
		// className: undefined,
		// component: undefined,
		// dropdownClassName: undefined,
		options: [
			"unordered",
			"ordered",
			// "indent",
			// "outdent",
		],
		// unordered: { icon: unordered, className: undefined },
		// ordered: { icon: ordered, className: undefined },
		// indent: { icon: indent, className: undefined },
		// outdent: { icon: outdent, className: undefined },
	},
	textAlign: {
		// inDropdown: false,
		// className: undefined,
		// component: undefined,
		// dropdownClassName: undefined,
		options: ["left", "center", "right", "justify"],
		// left: { icon: left, className: undefined },
		// center: { icon: center, className: undefined },
		// right: { icon: right, className: undefined },
		// justify: { icon: justify, className: undefined },
	},
	colorPicker: {
		// icon: color,
		// className: undefined,
		// component: undefined,
		// popupClassName: undefined,
		// colors: [
		// 	"rgb(97,189,109)",
		// 	"rgb(26,188,156)",
		// 	"rgb(84,172,210)",
		// 	"rgb(44,130,201)",
		// 	"rgb(147,101,184)",
		// 	"rgb(71,85,119)",
		// 	"rgb(204,204,204)",
		// 	"rgb(65,168,95)",
		// 	"rgb(0,168,133)",
		// 	"rgb(61,142,185)",
		// 	"rgb(41,105,176)",
		// 	"rgb(85,57,130)",
		// 	"rgb(40,50,78)",
		// 	"rgb(0,0,0)",
		// 	"rgb(247,218,100)",
		// 	"rgb(251,160,38)",
		// 	"rgb(235,107,86)",
		// 	"rgb(226,80,65)",
		// 	"rgb(163,143,132)",
		// 	"rgb(239,239,239)",
		// 	"rgb(255,255,255)",
		// 	"rgb(250,197,28)",
		// 	"rgb(243,121,52)",
		// 	"rgb(209,72,65)",
		// 	"rgb(184,49,47)",
		// 	"rgb(124,112,107)",
		// 	"rgb(209,213,216)",
		// ],
	},
	link: {
		// inDropdown: false,
		// className: undefined,
		// component: undefined,
		// popupClassName: undefined,
		// dropdownClassName: undefined,
		// showOpenOptionOnHover: true,
		// defaultTargetOption: "_self",
		options: [
			"link",
			// "unlink",
		],
		// link: { icon: link, className: undefined },
		// unlink: { icon: unlink, className: undefined },
		// linkCallback: undefined,
	},
	emoji: {
		// icon: emoji,
		// className: undefined,
		// component: undefined,
		// popupClassName: undefined,
		// emojis: [
		// 	"😀",
		// 	"😁",
		// 	"😂",
		// 	"😃",
		// 	"😉",
		// 	"😋",
		// 	"😎",
		// 	"😍",
		// 	"😗",
		// 	"🤗",
		// 	"🤔",
		// 	"😣",
		// 	"😫",
		// 	"😴",
		// 	"😌",
		// 	"🤓",
		// 	"😛",
		// 	"😜",
		// 	"😠",
		// 	"😇",
		// 	"😷",
		// 	"😈",
		// 	"👻",
		// 	"😺",
		// 	"😸",
		// 	"😹",
		// 	"😻",
		// 	"😼",
		// 	"😽",
		// 	"🙀",
		// 	"🙈",
		// 	"🙉",
		// 	"🙊",
		// 	"👼",
		// 	"👮",
		// 	"🕵",
		// 	"💂",
		// 	"👳",
		// 	"🎅",
		// 	"👸",
		// 	"👰",
		// 	"👲",
		// 	"🙍",
		// 	"🙇",
		// 	"🚶",
		// 	"🏃",
		// 	"💃",
		// 	"⛷",
		// 	"🏂",
		// 	"🏌",
		// 	"🏄",
		// 	"🚣",
		// 	"🏊",
		// 	"⛹",
		// 	"🏋",
		// 	"🚴",
		// 	"👫",
		// 	"💪",
		// 	"👈",
		// 	"👉",
		// 	"👉",
		// 	"👆",
		// 	"🖕",
		// 	"👇",
		// 	"🖖",
		// 	"🤘",
		// 	"🖐",
		// 	"👌",
		// 	"👍",
		// 	"👎",
		// 	"✊",
		// 	"👊",
		// 	"👏",
		// 	"🙌",
		// 	"🙏",
		// 	"🐵",
		// 	"🐶",
		// 	"🐇",
		// 	"🐥",
		// 	"🐸",
		// 	"🐌",
		// 	"🐛",
		// 	"🐜",
		// 	"🐝",
		// 	"🍉",
		// 	"🍄",
		// 	"🍔",
		// 	"🍤",
		// 	"🍨",
		// 	"🍪",
		// 	"🎂",
		// 	"🍰",
		// 	"🍾",
		// 	"🍷",
		// 	"🍸",
		// 	"🍺",
		// 	"🌍",
		// 	"🚑",
		// 	"⏰",
		// 	"🌙",
		// 	"🌝",
		// 	"🌞",
		// 	"⭐",
		// 	"🌟",
		// 	"🌠",
		// 	"🌨",
		// 	"🌩",
		// 	"⛄",
		// 	"🔥",
		// 	"🎄",
		// 	"🎈",
		// 	"🎉",
		// 	"🎊",
		// 	"🎁",
		// 	"🎗",
		// 	"🏀",
		// 	"🏈",
		// 	"🎲",
		// 	"🔇",
		// 	"🔈",
		// 	"📣",
		// 	"🔔",
		// 	"🎵",
		// 	"🎷",
		// 	"💰",
		// 	"🖊",
		// 	"📅",
		// 	"✅",
		// 	"❎",
		// 	"💯",
		// ],
	},
	embedded: {
		// icon: embedded,
		// className: undefined,
		// component: undefined,
		// popupClassName: undefined,
		// embedCallback: undefined,
		// defaultSize: {
		// 	height: "auto",
		// 	width: "auto",
		// },
	},
	image: {
		// icon: image,
		// className: undefined,
		// component: undefined,
		// popupClassName: undefined,
		// urlEnabled: true,
		// uploadEnabled: true,
		// alignmentEnabled: true,
		// uploadCallback: undefined,
		// previewImage: false,
		// inputAccept:
		// 	"image/gif,image/jpeg,image/jpg,image/png,image/svg",
		// alt: { present: false, mandatory: false },
		// defaultSize: {
		// 	height: "auto",
		// 	width: "auto",
		// },
	},
	remove: {
		// icon: eraser,
		// className: undefined,
		// component: undefined,
	},
	history: {
		// inDropdown: false,
		// className: undefined,
		// component: undefined,
		// dropdownClassName: undefined,
		options: ["undo", "redo"],
		// undo: { icon: undo, className: undefined },
		// redo: { icon: redo, className: undefined },
	},
}

function NewsComments({ newsId, commentsCounter }) {
	const client = useApolloClient()
	const { user } = useContext(UserContext)
	const [editorState, setEditorState] = useState(() =>
		EditorState.createEmpty()
	)
	const [offsetIndex, setOffsetIndex] = useState(0)
	const [comments, setComments] = useState([])
	const { loading, error, data } = useQuery(COMMENTS_FOR_NEWS, {
		variables: {
			offsetIndex: offsetIndex,
			newsId: newsId,
		},
	})
	const [addComment] = useMutation(ADD_COMMENT)

	useEffect(() => {
		if (data) {
			console.log(data)
			setComments(comms => [...comms, ...data.commentsForNews])
		}
	}, [data])

	const onCommentRemove = id => {
		let tempArr = comments

		const commentIndex = tempArr.findIndex(comment => comment.id === id)

		tempArr.splice(commentIndex, 1)

	}

	const handlePost = e => {
		e.preventDefault()

		// body of the news in html format
		const html = draftToHtml(convertToRaw(editorState.getCurrentContent()))

		addComment({
			variables: {
				commentData: {
					parentId: newsId,
					parentType: "news",
					body: html,
				},
			},
			onCompleted: data => {
				client.clearStore()

				console.log(data)
				setComments(comms => [data.addComment.comment, ...comms])
			},
		})
		setComments([...tempArr])
	}

	return (
		<div className="comments">
			<div className="comments_input news_padding">
				<span className="comments_input_title">
					Comment as{" "}
					<Link to={`/profile/${user.id}`} className="news_authorlink">
						{user.fullName}
					</Link>
				</span>
				<div className="comments_editor_container">
					<Editor
						toolbar={editorOptions}
						toolbarCustomButtons={[
							<button
								onClick={handlePost}
								className="rdw-option-wrapper comments_editor_postbtn"
							>
								Post comment
							</button>,
						]}
						placeholder="Write here..."
						editorState={editorState}
						onEditorStateChange={setEditorState}
						wrapperClassName="comments_editor_wrapper"
						editorClassName="comments_editor"
						toolbarClassName="comments_editor_toolbar"
					/>
				</div>
			</div>
			<div className="comments_list">
				{comments.map(comment => (
					<Comment
						key={comment.id}
						data={comment}
						onCommentRemove={onCommentRemove}
					/>
				))}
				<button className="comments_more">
					Show {commentsCounter - comments.length} more comments
				</button>
				<QueryResult loading={loading} error={error} data={data} />
			</div>
		</div>
	)
}

export default NewsComments
