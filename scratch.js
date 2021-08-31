const arrivalTime = new Date("2021-04-05 21:15:00 UTC").getTime()
const departureTime = new Date("2021-04-06 01:11:25 UTC").getTime()
const maxMinutes = 180 * 60000

//departure time - arrival time must be < maxMinutes * 60,000
let totalTime = departureTime - arrivalTime
if (totalTime <= maxMinutes) {
	console.log("you good")
} else {
	console.log("no beuno")
}
//send good
//else you done fucked up msg

console.log(arrivalTime)
console.log(departureTime)
console.log(maxMinutes)
