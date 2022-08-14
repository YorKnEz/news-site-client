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
							<button
								className="button button_secondary modal_button"
								onClick={onDecline}
							>
								Cancel
							</button>
						)}
						{onSubmit && (
							<button
								className="button button_primary modal_button"
								onClick={onSubmit}
							>
								Ok
							</button>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default Modal
