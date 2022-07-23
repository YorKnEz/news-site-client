import { useEffect, useState } from "react"

export const useDocumentTitle = title => {
	const [documentTitle, setDocumentTitle] = useState(title)
	useEffect(() => {
		document.title = documentTitle
	}, [documentTitle])

	return [documentTitle, setDocumentTitle]
}

// updates inputs from Sign In and Sign Up page
export const updateInputLabels = () => {
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
export const handleInputFocus = e => {
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
export const handleInputBlur = e => {
	const label = e.target.previousElementSibling

	if (!e.target.value) {
		label.style.animationName = "labelIn"
		label.style.animationDuration = "0.2s"

		label.style.top = "var(--labelInTop)"
		label.style.left = "var(--labelInLeft)"
		label.style.color = "var(--secondText-color)"
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

	// if n is under 1000, return n
	if (n < 1000) result = `${n}`
	// if n is under 1000000, compress the last 3 zeroes
	else if (n < 1000000) result = `${n / 1000}K`
	// if n is under 1000000000, compress the last 6 zeroes
	else if (n < 1000000000) result = `${n / 1000000}M`
	// if n is under 1000000000000, compress the last 9 zeroes
	else if (n < 1000000000000) result = `${n / 1000000000}B`

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
