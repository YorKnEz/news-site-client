/* eslint-disable eqeqeq */
import React, { useContext, useEffect, useState } from "react"
import { Editor } from "react-draft-wysiwyg"
import { ContentState, convertToRaw, EditorState } from "draft-js"
import draftToHtml from "draftjs-to-html"
import htmlToDraft from "html-to-draftjs"
import { useForm } from "react-hook-form"
import {
	AiFillExclamationCircle,
	AiOutlinePicture,
	AiOutlineQuestionCircle,
} from "react-icons/ai"
import { Navigate, useNavigate, useParams } from "react-router"

import { useApolloClient, useMutation, useQuery } from "@apollo/client"
import axios from "axios"

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import "./CreateNews.scss"
import { Page, QueryResult } from "../components"
import { UserContext } from "../context"
import { NEWS_TO_EDIT, UPDATE_NEWS } from "../utils/apollo-queries"
import {
	handleInputBlur,
	handleInputFocus,
	isValidHttpUrl,
	updateInputLabels,
	useDocumentTitle,
} from "../utils/utils"

const ip = process.env.REACT_APP_EXPRESS_API_IP

function CreateNews() {
	const client = useApolloClient()
	const { newsId } = useParams()
	const [updateNews] = useMutation(UPDATE_NEWS)
	const { loading, error, data } = useQuery(NEWS_TO_EDIT, {
		variables: {
			newsId: newsId,
		},
	})
	const { user, token } = useContext(UserContext)
	const [editorState, setEditorState] = useState(() =>
		EditorState.createEmpty()
	)
	const {
		register,
		watch,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm()
	const watchThumbnail = watch("thumbnail", []) ? watch("thumbnail", []) : []
	const history = useNavigate()
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
	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] = useDocumentTitle(
		"Write your news story | YorkNews"
	)

	// set the news data to each input
	useEffect(() => {
		if (data) {
			// set the title
			setValue("title", data.news.title)

			// set the thumbnail
			const inputThumbnail = document.querySelector(".formItem_image_thumbnail")
			inputThumbnail.style.backgroundImage = data.news.thumbnail
				? `url("${data.news.thumbnail}")`
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

				requestBody.thumbnail = `${ip}/public/${fileName}`

				await axios({
					method: "post",
					url: `${ip}/news/upload-thumbnail`,
					data: form,
					headers: {
						authorization: token,
					},
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

	const isSizeOk = value => {
		// check if an image has been added and check if the size is less than 10MB
		if (value.length > 0) return value[0].size < 10485760

		// return true otherwise to avoid errors
		return true
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
						<div className="formItem">
							<label className="formItem_label" htmlFor="title">
								Title
							</label>
							<input
								className="formItem_input"
								id="title"
								name="title"
								autoComplete="off"
								type="text"
								onFocus={handleInputFocus}
								{...register("title", {
									required: true,
									onBlur: handleInputBlur,
								})}
							/>
							{errorCheck("title")}
						</div>
						<div className="thumbnail_wrapper">
							<div className="formItem">
								<label className="formItem_image_label" htmlFor="thumbnail">
									<span className="formItem_image_title">
										<AiOutlinePicture className="formItem_image_icon" />
										{watchThumbnail.length > 0
											? watchThumbnail[0].name
											: "Your thumbnail"}
									</span>
									<div
										className="formItem_image_thumbnail"
										style={{
											backgroundImage:
												watchThumbnail.length > 0
													? `url(${URL.createObjectURL(watchThumbnail[0])})`
													: "url(/default_thumbnail.png)",
										}}
									/>
								</label>
								<input
									className="formItem_image_input"
									id="thumbnail"
									name="thumbnail"
									type="file"
									accept="image/*"
									{...register("thumbnail", {
										required: false,
										validate: isSizeOk,
									})}
								/>
								{errorCheck("thumbnail")}
							</div>
						</div>
						<div className="editor_container">
							<Editor
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
							<h4>Sources</h4>
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
						<div className="formItem">
							<label className="formItem_label" htmlFor="source">
								Add Source
							</label>
							<input
								className="formItem_input"
								id="source"
								name="source"
								type="text"
								value={source}
								onChange={handleSource}
								onFocus={handleInputFocus}
								onBlur={handleInputBlur}
							/>
							{error2.sources.message && (
								<p className="formItem_error">
									<AiFillExclamationCircle className="formItem_error_icon" />
									{error2.sources.message}
								</p>
							)}
						</div>
						<div className="tags">
							<h4>Tags</h4>
							{tags.map(s => (
								<div className="tags_item" key={s} onClick={handleDeleteTag}>
									{s}
								</div>
							))}
						</div>
						<div className="formItem">
							<label className="formItem_label" htmlFor="tag">
								Add Tag
							</label>
							<input
								className="formItem_input"
								id="tag"
								name="tag"
								type="text"
								value={tag}
								onChange={handleTag}
								onFocus={handleInputFocus}
								onBlur={handleInputBlur}
							/>
							{error2.tags.message && (
								<p className="formItem_error">
									<AiFillExclamationCircle className="formItem_error_icon" />
									{error2.tags.message}
								</p>
							)}
						</div>
						{error2.other.message && (
							<p className="formItem_error">
								<AiFillExclamationCircle className="formItem_error_icon" />
								{error2.other.message}
							</p>
						)}
						<div>
							<div className="tooltip">
								<AiOutlineQuestionCircle className="tooltip_icon" />
								<p className="tooltip_text">
									Thumbnail size should be under 10MB.
								</p>
							</div>
							<div className="tooltip">
								<AiOutlineQuestionCircle className="tooltip_icon" />
								<p className="tooltip_text">
									In order to add sources and tags, write it down then type ','
									to add it to the list.
								</p>
							</div>
						</div>
						<button className="button button_primary form_submit">
							Edit your story
						</button>
					</form>
				</QueryResult>
			</div>
		</Page>
	)
}

export default CreateNews
