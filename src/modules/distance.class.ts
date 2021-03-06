//? this helper class contains methods to calculate distance between two points
//* import interfaces file
import { Coords } from './interfaces';
export class DistanceHelper {
	//*we define the points
	#firstPoint: Coords;
	#secondPoint: Coords;
	constructor(firstPoint:Coords, secondPoint:Coords) {
		//*catch the points from the constructor and assign them to this class attributes
		[this.#firstPoint, this.#secondPoint] = [firstPoint, secondPoint];
	}

	//* struct a function to calculate the distance based on haversine formula
	//? haversine formula calculate straight line distance between tow coordinates
	getCrowDistance():number {
		//*round the distance to be calculated in kilometers
		const round = 6371; // km
		//* prepare attributes for the formula
		const latitudeDifference = this.#toRadians(this.#secondPoint.lat - this.#firstPoint.lat);
		const longitudeDifference = this.#toRadians(this.#secondPoint.lng - this.#firstPoint.lng);
		const firstPointLatitude = this.#toRadians(this.#firstPoint.lat);
		const secondPointLatitude = this.#toRadians(this.#secondPoint.lat);
		//* calculate the angle
		const angle = Math.sin(latitudeDifference / 2) * Math.sin(latitudeDifference / 2) +
			Math.sin(longitudeDifference / 2) * Math.sin(longitudeDifference / 2) *
			Math.cos(firstPointLatitude) * Math.cos(secondPointLatitude);
		//* get the distance
		const d = 2 * Math.atan2(Math.sqrt(angle), Math.sqrt(1 - angle));
		//*round the distance in kilometers
		const distance = round * d;
		//* round the first digit of the distance
		return parseFloat(distance.toFixed(1));
	}

	// Converts numeric degrees to radians
	#toRadians(Value:number) :number {
		return Value * Math.PI / 180;
	}
}