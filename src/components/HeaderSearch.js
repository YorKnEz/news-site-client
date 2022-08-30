import React, { useState } from "react"
import { AiOutlineSearch } from "react-icons/ai"
import { useNavigate } from "react-router"

import "./HeaderSearch.scss"

function HeaderSearch() {
	const history = useNavigate()
	const params = new Proxy(new URLSearchParams(window.location.search), {
		get: (searchParams, prop) => searchParams.get(prop),
	})

	const [search, setSearch] = useState(params.search ? params.search : "")
	const [filter, setFilter] = useState(params.filter ? params.filter : "all")

	const handleSearch = async () => {
		history(`/search?search=${search}&filter=${filter}`, { replace: false })
		window.location.reload()
	}

	const handleSubmit = async e => {
		if (e.code === "Enter") {
			handleSearch(e)
		}
	}

	return (
		<div className="search" id="search">
			<div className="search_container">
				<input
					id="search-input"
					className="search_input"
					placeholder="Search..."
					type="text"
					onChange={e => setSearch(e.target.value)}
					onKeyDown={handleSubmit}
					value={search}
					title="Separate tags by ', ' and the rest by ' '"
				/>
				<select
					className="search_category"
					onChange={e => setFilter(e.target.value)}
					value={filter}
				>
					<option value="all">All</option>
					<option value="title">Title</option>
					<option value="body">Body</option>
					<option value="tags">Tags</option>
				</select>
			</div>
			<button onClick={handleSearch} className="search_button">
				<AiOutlineSearch className="search_button_icon" />
			</button>
		</div>
	)
}

export default HeaderSearch
