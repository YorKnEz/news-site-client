import React from "react"

import "./Modal.scss"

function Modal({ onSubmit, children }) {
	return (
		<>
			<div className="modal_overlay" />
			<div className="modal_background">
				<div className="modal">
					{children}
					<button className="modal_exit" onClick={onSubmit}>
						Ok
					</button>
				</div>
			</div>
		</>
	)
}

export default Modal
