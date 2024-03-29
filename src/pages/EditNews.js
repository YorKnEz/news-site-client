/* eslint-disable eqeqeq */
import React, { useContext, useEffect, useState } from "react"
import { Editor } from "react-draft-wysiwyg"
import { ContentState, convertToRaw, EditorState } from "draft-js"
import draftToHtml from "draftjs-to-html"
import htmlToDraft from "html-to-draftjs"
import { useForm } from "react-hook-form"
import { AiFillExclamationCircle } from "react-icons/ai"
import { Navigate, useNavigate, useParams } from "react-router"

import { useApolloClient, useMutation, useQuery } from "@apollo/client"
import axios from "axios"

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import "./CreateNews.scss"
import {
	FormControlledInput,
	FormInput,
	FormThumbnailInput,
	FormTooltips,
	Page,
	QueryResult,
} from "../components"
import { UserContext } from "../context"
import { NEWS_TO_EDIT, UPDATE_NEWS } from "../utils/apollo-queries"
import {
	isValidHttpUrl,
	updateInputLabels,
	useDocumentTitle,
} from "../utils/utils"

const ip = process.env.REACT_APP_API_IP
const port = process.env.REACT_APP_EXPRESS_API_PORT

const editorOptions = {
	inline: {
		options: [
			"bold",
			"italic",
			"underline",
			"strikethrough",
			// "monospace",
			"superscript",
			"subscript",
		],
	},
}

function EditNews() {
	const { newsId } = useParams()
	const history = useNavigate()

	const {
		register,
		watch,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm()
	const watchThumbnail = watch("thumbnail", [])

	const { user, token } = useContext(UserContext)
	const [editorState, setEditorState] = useState(() =>
		EditorState.createEmpty()
	)
	const [source, setSource] = useState("")
	const [sources, setSources] = useState([])
	const [tag, setTag] = useState("")
	const [tags, setTags] = useState([])
	const [error2, setError2] = useState({
		sources: {},
		tags: {},
		editor: {},
		other: {},
	})

	const client = useApolloClient()
	const { loading, error, data } = useQuery(NEWS_TO_EDIT, {
		variables: {
			newsId: newsId,
		},
	})
	const [updateNews] = useMutation(UPDATE_NEWS)

	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] = useDocumentTitle(
		"Write your news story | YorkNews"
	)

	const tooltips = [
		"Thumbnail size should be under 10MB.",
		"In order to add sources and tags, write it down then type ',' to add it to the list.",
	]

	// set the news data to each input
	useEffect(() => {
		if (data) {
			// set the title
			setValue("title", data.news.title)

			// set the thumbnail
			const inputThumbnail = document.querySelector(".formItem_image_thumbnail")
			inputThumbnail.style.backgroundImage = data.news.thumbnail
				? `url("${ip}:${port}/public/${data.news.thumbnail}")`
				: "url(/default_thumbnail.png)"

			// set the editorState
			const { contentBlocks, entityMap } = htmlToDraft(data.news.body)
			const contentState = ContentState.createFromBlockArray(
				contentBlocks,
				entityMap
			)
			setEditorState(EditorState.createWithContent(contentState))

			// set the sources
			setSources(data.news.sources.split(","))

			// set the tags
			if (data.news.tags.length > 0) setTags(data.news.tags.split(","))

			// check if any input has been autofilled in order to change the label position
			updateInputLabels()
		}
	}, [data, setValue])

	// if the user pressed enter, submit the form
	window.addEventListener("keyup", e => {
		if (e.key === "Enter") handleSubmit(onSubmit)()
	})

	const onSubmit = async formData => {
		try {
			// check if any sources were added, if not return error
			if (sources.length === 0) {
				setError2({
					...error2,
					sources: { message: "This field is required" },
				})

				return
			}
			// body of the news in html format
			const html = draftToHtml(convertToRaw(editorState.getCurrentContent()))

			// check if the length of the body is above 200, if not return error
			if (html.length < 200) {
				setError2({
					...error2,
					editor: {
						message: "The body should be at least 200 characters long",
					},
				})

				return
			}

			// sources concatenated in a single string separated by ','
			let sourcesFinal = ""
			sourcesFinal = sourcesFinal.concat(sources)

			// tags concatenated in a single string separated by ','
			let tagsFinal = ""
			tagsFinal = tagsFinal.concat(tags)

			const requestBody = {
				title: formData.title,
				sources: sourcesFinal,
				tags: tagsFinal,
				body: html,
			}

			if (formData.thumbnail[0]) {
				const thumbnail = formData.thumbnail[0] ? formData.thumbnail[0] : ""
				const fileName = Date.now() + "-" + thumbnail.name

				const form = new FormData()

				form.append("file", thumbnail, fileName)

				requestBody.thumbnail = fileName

				await axios({
					headers: {
						authorization: token,
					},
					method: "post",
					url: `${ip}:${port}/utils/upload-thumbnail`,
					data: form,
				})
			}

			updateNews({
				variables: {
					id: data.news.id,
					newsData: requestBody,
				},
				onCompleted: ({ updateNews }) => {
					if (!updateNews.success) {
						setError2({
							...error2,
							other: { message: updateNews.message },
						})

						return
					}

					client.clearStore()

					history(`/news/${data.news.link}-${data.news.id}`)
				},
				onError: error => console.log({ ...error }),
			})
		} catch (error) {
			setError2({
				...error2,
				other: { message: error?.response?.data?.message || error.message },
			})
			console.error(error?.response?.data?.message || error.message)
		}
	}

	const handleSource = e => {
		let sourceInput = e.target.value
		setSource(sourceInput)

		if (sourceInput.endsWith(",")) {
			sourceInput = sourceInput.slice(0, sourceInput.length - 1)

			if (isValidHttpUrl(sourceInput)) {
				if (sources.findIndex(source => source === sourceInput) >= 0) {
					setError2({
						...error2,
						sources: { message: "Source already added" },
					})

					return
				}

				setError2({
					...error2,
					sources: {},
				})

				setSources([...sources, sourceInput])

				setSource("")

				return
			}

			setError2({
				...error2,
				sources: { message: "Invalid source" },
			})
		}
	}

	const handleDeleteSource = e => {
		e.preventDefault()

		const indexOfSource = sources.findIndex(el => el === e.target.innerHTML)

		let newSources = [...sources]

		newSources.splice(indexOfSource, 1)

		setSources(newSources)
	}

	const handleTag = e => {
		let tagInput = e.target.value

		setTag(tagInput)

		if (tagInput.endsWith(",")) {
			tagInput = tagInput.slice(0, tagInput.length - 1)

			if (/^[A-Za-z0-9 ]*$/.test(tagInput)) {
				if (tags.findIndex(tag => tag === tagInput) >= 0) {
					setError2({
						...error2,
						tags: { message: "Tag already added" },
					})

					return
				}

				setError2({
					...error2,
					tags: {},
				})

				setTags([...tags, tagInput])

				setTag("")

				return
			}

			setError2({
				...error2,
				tags: { message: "A tag should only contain letters and numbers" },
			})
		}
	}

	const handleDeleteTag = e => {
		e.preventDefault()

		const indexOfTag = tags.findIndex(el => el === e.target.innerHTML)

		let newTags = [...tags]

		newTags.splice(indexOfTag, 1)

		setTags(newTags)
	}

	const errorCheck = name => {
		if (errors[name] && errors[name].type === "required")
			return (
				<p className="formItem_error">
					<AiFillExclamationCircle className="formItem_error_icon" />
					This field is required.
				</p>
			)

		if (errors[name] && errors[name].type === "validate")
			return (
				<p className="formItem_error">
					<AiFillExclamationCircle className="formItem_error_icon" />
					Thumbnail size should not exceed 10MB.
				</p>
			)
	}

	return (
		<Page>
			<div className="createnews">
				<QueryResult loading={loading} error={error} data={data}>
					{data?.news.author.id != user.id && <Navigate to="/" replace />}

					<h3>Write your news story</h3>

					<form id="form" className="form" onSubmit={handleSubmit(onSubmit)}>
						<FormInput
							register={register}
							errorCheck={errorCheck}
							title="Title"
							id="title"
							type="text"
						/>
						<FormThumbnailInput
							register={register}
							errorCheck={errorCheck}
							thumbnail={watchThumbnail}
						/>
						<div className="editor_container">
							<Editor
								toolbar={editorOptions}
								placeholder="Write here..."
								editorState={editorState}
								onEditorStateChange={setEditorState}
								wrapperClassName="editor_wrapper"
								editorClassName="editor"
								toolbarClassName="editor_toolbar"
							/>
						</div>
						{error2.editor.message && (
							<p className="formItem_error">
								<AiFillExclamationCircle className="formItem_error_icon" />
								{error2.editor.message}
							</p>
						)}
						<div className="sources">
							<span className="sources_title">Sources</span>
							{sources.map(s => (
								<div
									className="sources_item"
									key={s}
									onClick={handleDeleteSource}
								>
									{s}
								</div>
							))}
						</div>
						<FormControlledInput
							title="Add Source"
							id="source"
							type="text"
							value={source}
							setValue={handleSource}
							error={error2.sources.message}
						/>
						<div className="tags">
							<span className="tags_title">Tags</span>
							{tags.map(s => (
								<div className="tags_item" key={s} onClick={handleDeleteTag}>
									{s}
								</div>
							))}
						</div>
						<FormControlledInput
							title="Add Tag"
							id="tag"
							type="text"
							value={tag}
							setValue={handleTag}
							error={error2.tags.message}
						/>
						{error2.other.message && (
							<p className="formItem_error">
								<AiFillExclamationCircle className="formItem_error_icon" />
								{error2.other.message}
							</p>
						)}
						<FormTooltips tooltips={tooltips} />
						<button className="button button_primary form_submit">
							Edit your story
						</button>
					</form>
				</QueryResult>
			</div>
		</Page>
	)
}

export default EditNews
