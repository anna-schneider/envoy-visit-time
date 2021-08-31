const express = require("express")
const { middleware, errorMiddleware } = require("@envoy/envoy-integrations-sdk")
require("dotenv").config() // For testing/development only

const app = express()
app.use(middleware())

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
	const totalTime = departureTime - arrivalTime

	if (totalTime > maxMinutes) {
		message = `${message}, "You have overstayed your booking"`
	}

	await job.attach({ label: "Goodbye", value: message })

	res.send({ message })
})

//https://github.com/envoy/envoy-integrations-sdk-nodejs
//The documentation indicates that only requests made via Envoy as an origin would be accepted,
//so as a result I was unsure of how to test the visitor-sign-out endpoint. That said, using the
//"goodbye" example as a frame of reference for UTC conversion, this is how I imagine to the best of my ability
//that the request would be done outside of having an authenticated sample Envoy request to work with.

app.use(
	errorMiddleware((err) => {
		console.log(err.message)
	})
)

const listener = app.listen(process.env.PORT || 5000, () => {
	console.log(`Listening on port ${listener.address().port}`)
})
