import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"
import React from "react"
import ReactDOM from "react-dom/client"

import "./index.scss"
import App from "./App"

const ip = process.env.REACT_APP_API_IP
const port = process.env.REACT_APP_APOLLO_API_PORT

const client = new ApolloClient({
	uri: `${ip}:${port}`,
	cache: new InMemoryCache(),
	headers: {
		authorization: localStorage.getItem("token") || "",
	},
})

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
)
