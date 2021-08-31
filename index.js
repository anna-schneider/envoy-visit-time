const express = require("express")
const morgan = require("morgan")
const { middleware, errorMiddleware } = require("@envoy/envoy-integrations-sdk")

const app = express()
app.use(middleware())
app.use(morgan("dev"))

app.post("/max-minutes-validation", (req, res) => {
	const maxMinutes = req.envoy.payload.maxMinutes
	if (!Number.isNaN(maxMinutes) && maxMinutes >= 0 && maxMinutes <= 180) {
		res.send({ maxMinutes })
	} else {
		res.status(400).json({ message: "Please enter a number between 0 - 180" })
	}
})

app.post("/entry-sign-out", async (req, res) => {
	const envoy = req.envoy
	const job = envoy.job
	const maxMinutes = envoy.meta.config.maxMinutes * 60000
	const visitor = envoy.payload
	const visitorName = visitor.attributes["full-name"]
	const message = `Goodbye ${visitorName}!`
	const arrivalTime = new Date(visitor.attributes["signed-in-at"]).getTime()
	const departureTime = new Date(visitor.attributes["signed-out-at"]).getTime()
	let totalTime = departureTime - arrivalTime

	if (totalTime > maxMinutes) {
		message = `${message}, "You have overstayed your booking"`
	}

	await job.attach({ label: "Goodbye", value: message })

	res.send({ message })
})

app.use(
	errorMiddleware((err) => {
		console.log(err.message)
	})
)

const listener = app.listen(process.env.PORT || 5000, () => {
	console.log(`Listening on port ${listener.address().port}`)
})
