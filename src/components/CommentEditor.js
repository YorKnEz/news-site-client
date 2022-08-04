import React, { useEffect, useState } from "react"
import { Editor } from "react-draft-wysiwyg"
import { ContentState, convertToRaw, EditorState } from "draft-js"
import draftToHtml from "draftjs-to-html"

import { useApolloClient, useMutation } from "@apollo/client"

import "./CommentEditor.scss"
import { ADD_COMMENT, EDIT_COMMENT } from "../utils/apollo-queries"
import htmlToDraft from "html-to-draftjs"

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

function CommentEditor({
	setError,
	parentId,
	parentType,
	onCommentAdd,
	commentToEdit,
	onCommentEdit,
	onEditorCancel,
}) {
	const client = useApolloClient()
	const [editorState, setEditorState] = useState(() =>
		EditorState.createEmpty()
	)

	const [addComment] = useMutation(ADD_COMMENT)
	const [editComment] = useMutation(EDIT_COMMENT)

	useEffect(() => {
		// set the editorState to match the body of the comment
		if (commentToEdit) {
			const { contentBlocks, entityMap } = htmlToDraft(commentToEdit.body)
			const contentState = ContentState.createFromBlockArray(
				contentBlocks,
				entityMap
			)
			setEditorState(EditorState.createWithContent(contentState))
		}
	}, [commentToEdit])

	const handlePost = e => {
		e.preventDefault()

		// body of the news in html format
		const html = draftToHtml(convertToRaw(editorState.getCurrentContent()))

		addComment({
			variables: {
				commentData: {
					parentId,
					parentType,
					body: html,
				},
			},
			onCompleted: ({ addComment }) => {
				if (!addComment.success) {
					setError(addComment.message)

					return
				}

				client.clearStore()

				onCommentAdd(addComment.comment)
			},
			onError: error => console.log({ ...error }),
		})
	}

	const handleEdit = e => {
		e.preventDefault()

		// body of the news in html format
		const html = draftToHtml(convertToRaw(editorState.getCurrentContent()))

		client.clearStore()

		editComment({
			variables: {
				commentData: {
					parentId,
					parentType,
					body: html,
				},
				id: commentToEdit.id,
			},
			onCompleted: ({ editComment }) => {
				if (!editComment.success) {
					setError(editComment.message)

					return
				}

				client.clearStore()

				onCommentEdit(editComment.comment)
			},
			onError: error => console.log({ ...error }),
		})
	}

	// required to avoid a warning
	function Buttons({ modalHandle, editorState, ...rest }) {
		return (
			<div className="comment-editor_buttons">
				{commentToEdit && (
					<button onClick={handleEdit} className="comment-editor_buttons_item">
						Edit comment
					</button>
				)}
				{onEditorCancel && (
					<button
						onClick={onEditorCancel}
						className="comment-editor_buttons_item"
					>
						Cancel
					</button>
				)}
				{!commentToEdit && (
					<button onClick={handlePost} className="comment-editor_buttons_item">
						Post comment
					</button>
				)}
			</div>
		)
	}

	return (
		<div
			className={`comment-editor_container ${
				commentToEdit && "comment-editor_edit-container"
			}`}
		>
			<Editor
				toolbar={editorOptions}
				toolbarCustomButtons={[<Buttons />]}
				placeholder="Write here..."
				editorState={editorState}
				onEditorStateChange={setEditorState}
				wrapperClassName="comment-editor_wrapper"
				editorClassName="comment-editor"
				toolbarClassName="comment-editor_toolbar"
			/>
		</div>
	)
}

export default CommentEditor
