const express = require("express")
const { middleware, errorMiddleware } = require("@envoy/envoy-integrations-sdk")

const app = express()
app.use(middleware())

app.post("/goodbye-options", (req, res) => {
	res.send([
		{
			label: "Goodbye",
			value: "Goodbye",
		},
		{
			label: "Adios",
			value: "Adios",
		},
		{
			label: "Aloha",
			value: "Aloha",
		},
	])
})

app.post("/entry-sign-out", async (req, res) => {
	const envoy = req.envoy // Envoy middleware adds an "envoy" object to req.
	const job = envoy.job
	const goodbye = envoy.meta.config.GOODBYE
	const visitor = envoy.payload
	const visitorName = visitor.attributes["full-name"]

	const message = `${goodbye} ${visitorName}!`
	await job.attach({ label: "Goodbye", value: message })

	res.send({ goodbye })
})

app.use(errorMiddleware())

const listener = app.listen(process.env.PORT || 3000, () => {
	console.log(`Listening on port ${listener.address().port}`)
})
