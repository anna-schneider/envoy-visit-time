const express = require("express")
const { middleware, errorMiddleware } = require("@envoy/envoy-integrations-sdk")

const app = express()
app.use(middleware())
//validate "validations"
app.post("/max-minutes-validation", (req, res) => {
	const maxMinutes = req.envoy.payload.maxMinutes
	if (!Number.isNaN(maxMinutes) && maxMinutes >= 0 && maxMinutes <= 180) {
		res.send({ maxMinutes })
	} else {
		res.status(400).json({ message: "Please enter a number between 0 - 180" })
	}

	// console.log(req.envoy.payload.maxMinutes)
})

app.post("/entry-sign-out", async (req, res) => {
	const envoy = req.envoy // Envoy's middleware adds an "envoy" object to req.
	const job = envoy.job
	const maxMinutes = envoy.meta.config.maxMinutes
	const visitor = envoy.payload
	const arrivalTime = new Date(visitor.attributes["signed-in-at"])
	const departureTime = new Date(visitor.attributes["signed-out-at"])

	console.log(arrivalTime)
	console.log(departureTime)
	console.log(maxMinutes)
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
