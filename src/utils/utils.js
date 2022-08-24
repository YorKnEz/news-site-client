import { useEffect, useState } from "react"

export const useDocumentTitle = title => {
	const [documentTitle, setDocumentTitle] = useState(title)
	useEffect(() => {
		document.title = documentTitle
	}, [documentTitle])

	return [documentTitle, setDocumentTitle]
}

export const useReachedBottom = (loading, error) => {
	const [reachedBottom, setReachedBottom] = useState({})

	// check if the user scrolled to the bottom of the page so we can request more news only then
	window.addEventListener("scroll", event => {
		const { scrollHeight, scrollTop } = event.target.scrollingElement
		const innerHeight = window.innerHeight

		if (!loading && !error && scrollHeight - innerHeight - scrollTop <= 1) {
			setReachedBottom(true)
		}
	})

	return [reachedBottom, setReachedBottom]
}

// updates inputs from Sign In and Sign Up page
export const updateInputLabels = () => {
	const form = document.querySelector("#form")

	for (let i = 0; i < form.elements.length; i++) {
		const input = form.elements[i]

		// check if the input is a form input
		if (input.value && input.classList.contains("formItem_input")) {
			const label = input.previousElementSibling

			label.style.top = "var(--labelOutTop)"
			label.style.left = "var(--labelOutLeft)"
			label.style.color = "var(--text-color)"
		}
	}
}

// handles focus event for Sing In and Sign Up pages forms
export const handleInputFocus = e => {
	if (e.target.classList.contains("formItem_input")) {
		const label = e.target.previousElementSibling

		if (!e.target.value) {
			label.style.animationName = "labelOut"
			label.style.animationDuration = "0.2s"

			label.style.top = "var(--labelOutTop)"
			label.style.left = "var(--labelOutLeft)"
			label.style.color = "var(--text-color)"
		}
	}
}

// handles blur event for Sing In and Sign Up pages forms
export const handleInputBlur = e => {
	if (e.target.classList.contains("formItem_input")) {
		const label = e.target.previousElementSibling

		if (!e.target.value) {
			label.style.animationName = "labelIn"
			label.style.animationDuration = "0.2s"

			label.style.top = "var(--labelInTop)"
			label.style.left = "var(--labelInLeft)"
			label.style.color = "var(--disabled-color)"
		}
	}
}

export const isValidHttpUrl = string => {
	let url

	try {
		url = new URL(string)
	} catch (_) {
		return false
	}

	return url.protocol === "http:" || url.protocol === "https:"
}

export const compressNumber = n => {
	// the result
	let result = ""

	if (n === 0) return "0"

	const size = ["", "K", "M", "B"]

	let powerOf10 = n > 0 ? 1000 : -1000
	let sign = n > 0 ? "" : "-"

	for (let i in size) {
		if ((n < powerOf10 && n > 0) || (n > powerOf10 && n < 0)) {
			result = `${sign}${n / (powerOf10 / 1000)}${size[i]}`

			break
		}

		powerOf10 *= 1000
	}

	// check if the result has been modified
	if (result !== "") {
		// find the . (that means the result has decimals after the compression)
		const index = result.indexOf(".")

		// if there is no . then return the result as it is
		if (index === -1) return result

		// check if the first decimal is a 0
		if (result[index + 1] === "0")
			return result.slice(0, index) + result[result.length - 1]

		// if there was a . keep only the first decimal
		return result.slice(0, index + 2) + result[result.length - 1]
	}

	// if result was an empty string return N/A
	return "N/A"
}
