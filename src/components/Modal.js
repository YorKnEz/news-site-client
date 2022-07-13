import React from "react"

import "./Modal.scss"

function Modal({ onSubmit, children, onDecline }) {
	return (
		<>
			<div className="modal_overlay" />
			<div className="modal_background">
				<div className="modal">
					{children}
					<div className="modal_buttons">
						{onDecline && (
							<button className="button button_secondary" onClick={onDecline}>
								Cancel
							</button>
						)}
						<button className="button button_primary" onClick={onSubmit}>
							Ok
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

export default Modal
