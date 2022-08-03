import React from "react"

export const UserContext = React.createContext({
	token: "",
	user: {},
	signIn: () => {},
	signOut: () => {},
	verifyEmail: () => {},
})
