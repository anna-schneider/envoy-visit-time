const express = require("express")
const { middleware, errorMiddleware } = require("@envoy/envoy-integrations-sdk")

const app = express()
app.use(middleware())
//validate "validations"
app.post("/max-minutes-validation", (req, res) => {
	res.status(400).json({ message: "You done messed up now" })
	// res.send({ maxMinutes: req.envoy.payload.maxMessage })
	// console.log(req.envoy.payload.maxMinutes)
})

app.post("/entry-sign-out", async (req, res) => {
	const envoy = req.envoy // Envoy's middleware adds an "envoy" object to req.
	const job = envoy.job
	const maxMinutes = envoy.meta.config.MAXMINUTES
	const visitor = envoy.payload
	const visitorName = visitor.attributes["full-name"]
	const message = `${goodbye} ${visitorName}!`
	await job.attach({ label: "Goodbye", value: message })

	res.send({ goodbye })
})

app.use(
	errorMiddleware((err) => {
		console.log(err.message)
	})
)

const listener = app.listen(process.env.PORT || 5000, () => {
	console.log(`Listening on port ${listener.address().port}`)
})
