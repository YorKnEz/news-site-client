import { useEffect, useState } from "react"

const useDocumentTitle = title => {
	const [documentTitle, setDocumentTitle] = useState(title)
	useEffect(() => {
		document.title = documentTitle
	}, [documentTitle])

	return [documentTitle, setDocumentTitle]
}

// updates inputs from Sign In and Sign Up page
const updateInputLabels = () => {
	const form = document.querySelector("#form")

	for (let i = 0; i < form.elements.length; i++) {
		const input = form.elements[i]

		if (input.value) {
			const label = input.previousElementSibling

			label.style.top = "var(--labelOutTop)"
			label.style.left = "var(--labelOutLeft)"
			label.style.color = "var(--text-color)"
		}
	}
}

// handles focus event for Sing In and Sign Up pages forms
const handleInputFocus = e => {
	const label = e.target.previousElementSibling

	if (!e.target.value) {
		label.style.animationName = "labelOut"
		label.style.animationDuration = "0.2s"

		label.style.top = "var(--labelOutTop)"
		label.style.left = "var(--labelOutLeft)"
		label.style.color = "var(--text-color)"
	}
}

// handles blur event for Sing In and Sign Up pages forms
const handleInputBlur = e => {
	const label = e.target.previousElementSibling

	if (!e.target.value) {
		label.style.animationName = "labelIn"
		label.style.animationDuration = "0.2s"

		label.style.top = "var(--labelInTop)"
		label.style.left = "var(--labelInLeft)"
		label.style.color = "var(--secondText-color)"
	}
}

const isValidHttpUrl = string => {
	let url

	try {
		url = new URL(string)
	} catch (_) {
		return false
	}

	return url.protocol === "http:" || url.protocol === "https:"
}

export {
	useDocumentTitle,
	updateInputLabels,
	handleInputBlur,
	handleInputFocus,
	isValidHttpUrl,
}
