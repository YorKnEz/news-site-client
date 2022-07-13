import React, { useContext, useEffect, useState } from "react"
import { convertToRaw, EditorState } from "draft-js"
import { Editor } from "react-draft-wysiwyg"
import draftToHtml from "draftjs-to-html"
import { useForm } from "react-hook-form"
import { AiFillExclamationCircle, AiOutlinePicture } from "react-icons/ai"
import axios from "axios"
import format from "date-fns/format"

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import "./CreateNews.scss"
import { Page } from "../components"
import {
	handleInputBlur,
	handleInputFocus,
	isValidHttpUrl,
	updateInputLabels,
	useDocumentTitle,
} from "../utils"
import { UserContext } from "../context"
import { useNavigate } from "react-router"

const ip = process.env.REACT_APP_EXPRESS_API_IP

function CreateNews() {
	const [editorState, setEditorState] = useState(() =>
		EditorState.createEmpty()
	)
	const { user, token } = useContext(UserContext)
	const {
		register,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm()
	const watchThumbnail = watch("thumbnail", [])
	const history = useNavigate()
	const [source, setSource] = useState("")
	const [sources, setSources] = useState([])
	const [tag, setTag] = useState("")
	const [tags, setTags] = useState([])
	const [error, setError] = useState("")
	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] = useDocumentTitle(
		"Write your news story | YorkNews"
	)

	// check if any input has been autofilled in order to change the label position
	useEffect(() => updateInputLabels())

	const onSubmit = async data => {
		// body of the news in html format
		const html = draftToHtml(convertToRaw(editorState.getCurrentContent()))

		// sources concatenated in a single string separated by ','
		let sourcesFinal = ""
		sourcesFinal = sourcesFinal.concat(sources)

		// tags concatenated in a single string separated by ','
		let tagsFinal = ""
		tagsFinal = tagsFinal.concat(tags)

		const thumbnail = data.thumbnail[0] ? data.thumbnail[0] : ""
		const fileName = Date.now() + "-" + thumbnail.name

		const form = new FormData()

		form.append("file", thumbnail, fileName)

		await axios({
			method: "post",
			url: `${ip}/news/upload-thumbnail`,
			data: form,
			headers: {
				authorization: token,
			},
		})
			.then(res => {
				console.log(res)
			})
			.catch(e => console.log(e?.response?.data?.error || e.message))

		const requestBody = {
			title: data.title,
			authorEmail: user.email,
			date: format(new Date(), "MMMM d',' yyyy"),
			thumbnail: `${ip}/public/${fileName}`,
			sources: sourcesFinal,
			tags: tagsFinal,
			body: html,
			type: "created",
		}

		await axios({
			method: "post",
			url: `${ip}/news/create`,
			data: requestBody,
			headers: {
				authorization: token,
			},
		})
			.then(res => {
				console.log(res)

				history(`/news/${res.data.news.id}`)
			})
			.catch(e => console.log(e?.response?.data?.error || e.message))
	}

	const handleSource = e => {
		let sourceInput = e.target.value
		setSource(sourceInput)

		if (sourceInput.endsWith(",")) {
			sourceInput = sourceInput.slice(0, sourceInput.length - 1)

			if (isValidHttpUrl(sourceInput)) {
				if (sources.findIndex(source => source === sourceInput) >= 0) {
					setError("Source already added")

					return
				}

				setError("")

				setSources([...sources, sourceInput])

				setSource("")

				return
			}

			setError("Invalid source")
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
		e.preventDefault()

		let tagInput = e.target.value

		setTag(tagInput)

		if (tagInput.endsWith(",")) {
			tagInput = tagInput.slice(0, tagInput.length - 1)

			if (/^[A-Za-z0-9 ]*$/.test(tagInput)) {
				if (tags.findIndex(tag => tag === tagInput) >= 0) {
					setError("Tag already added")

					return
				}

				setError("")

				setTags([...tags, tagInput])

				setTag("")

				return
			}

			setError("A tag should contain only letters and numbers")
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
		console.log(value[0].size)

		return value[0].size < 10485760
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
			<h1>Write your news story</h1>
			<h2>Start editing to see some magic happen!</h2>

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
					<div
						style={{
							backgroundImage:
								watchThumbnail.length > 0
									? `url(${URL.createObjectURL(watchThumbnail[0])})`
									: "url(/default_thumbnail.png)",
						}}
						className="thumbnail"
					></div>
					<div className="formItem">
						<label className="formItem_fileLabel" htmlFor="thumbnail">
							<AiOutlinePicture className="formItem_fileIcon" />
							{watchThumbnail.length > 0
								? watchThumbnail[0].name
								: "Your thumbnail"}
						</label>
						<input
							className="formItem_fileInput"
							id="thumbnail"
							name="thumbnail"
							type="file"
							accept="image/*"
							{...register("thumbnail", {
								required: true,
								validate: isSizeOk,
							})}
						/>
						{errorCheck("thumbnail")}
					</div>
				</div>
				<div
					style={{
						border: "1px solid var(--text-color)",
						minHeight: "400px",
						marginTop: "10px",
					}}
				>
					<Editor
						placeholder="Write here..."
						editorState={editorState}
						onEditorStateChange={setEditorState}
						wrapperClassName="editor_wrapper"
						editorClassName="editor"
						toolbarClassName="editor_toolbar"
					/>
				</div>
				<div className="sources">
					<h4>Sources</h4>
					{sources.map(s => (
						<div className="sources_item" key={s} onClick={handleDeleteSource}>
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
				</div>
				{error && (
					<p className="formItem_error">
						<AiFillExclamationCircle className="formItem_error_icon" />
						{error}
					</p>
				)}
				<button className="button button_primary form_submit">
					Post your story
				</button>
			</form>
		</Page>
	)
}

export default CreateNews
