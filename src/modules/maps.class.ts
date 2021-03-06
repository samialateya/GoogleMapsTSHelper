//*import Distance helper class used to get crow distance
import { DistanceHelper } from './distance.class';
//* import interfaces file
import { Bounds, Coords } from './interfaces';

//?this Maps helper class contains methods to simplify working with google maps SDK
export class Maps {
	//*we define the points
	private latitude : number;
	private longitude : number;
	//*drawing elements 
	private mapsDrawingArea : HTMLElement;
	//*define attributes to hold maps and marker instances 
	private mapsInstances : google.maps.Map;
	private markerInstances: any;
	//*attribute to save current coordinates when it's been calculated
	private currentCoords : Coords;
	
	//?in the constructor we assign the attributes and insatiate the map
	constructor(latitude: number, longitude: number, mapsDrawingArea: HTMLElement) {
		//*we catch the default coordinates to draw thw map
		this.latitude = latitude ?? 0;
		this.longitude = longitude ?? 0;
		//*set current coordinates to the default coordinates
		this.currentCoords = {
			lat: this.latitude,
			lng: this.longitude
		}
		//assign the marker instance to null
		this.markerInstances = null;
		//catch maps drawing element
		this.mapsDrawingArea = mapsDrawingArea;
		//! use restriction bounds to draw specific part of the map
		const RESTRICTION_BOUNDS: Bounds = {
			north: -34.36,
			south: -47.35,
			west: 166.28,
			east: -175.81,
		};
		//*instantiate the map
		this.mapsInstances = new google.maps.Map(this.mapsDrawingArea, {
			center: <Coords> this.currentCoords,
			zoom: <number> 3,
			// restriction: {
			// 	latLngBounds: RESTRICTION_BOUNDS,
			// 	strictBounds: false,
			// },
		});
	}

	//*a getter to grab maps instance
	get getMapsInstances() : google.maps.Map {
		return this.mapsInstances;
	}

	//*fetch current user coordinates and viewed it on the map
	getCurrentLocation() :void{
		//!abort if the user browser dose not support geolocation
		if (!navigator.geolocation) {
			this.infoWindow("Your browser doesn't support geolocation.");
			return;
		}
		//* get current location from the geolocation object
		navigator.geolocation.getCurrentPosition(
			//*success callback
			(position) => {
				//save current position
				this.currentCoords = <Coords>{
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				//move map position to view the user current location
				this.changeMapPosition(this.currentCoords.lat, this.currentCoords.lng);
				//zoom in
				this.changeMapZoom(16);
				//*define a marker options to be dropped in users current location
				const markerOptions = {
					position: <Coords> this.currentCoords,
					map: <google.maps.Map> this.mapsInstances,
					icon: "http://maps.google.com/mapfiles/kml/pal3/icon40.png",
					title: "Lat: " + this.currentCoords.lat + ", Lng: " + this.currentCoords.lng,
				}
				//*draw the marker
				new google.maps.Marker(markerOptions);
			},
			//*error callback
			() => {
				this.infoWindow("The Geolocation service failed.");
			},
			//*additional options
			{
				enableHighAccuracy: true,
				timeout: 5000,
				maximumAge: 0
			}
		);
	}

	//*move map position to new coordinates
	changeMapPosition(latitude:number, longitude:number):void {
		this.mapsInstances.setCenter({
			lat: latitude,
			lng: longitude,
		});
	}

	//*change maps zoom level
	changeMapZoom(zoom:number):void {
		this.mapsInstances.setZoom(zoom);
	}

	//*define info window to print messages to user on the map
	infoWindow(message:string):void {
		const infoWindow = new google.maps.InfoWindow();
		const windowPosition = this.mapsInstances.getCenter()
		infoWindow.setPosition(windowPosition);
		infoWindow.setContent(message);
		infoWindow.open(this.mapsInstances);
	}

	//*drop a marker on the map
	putMarker(latitude:number, longitude:number, icon:string) {
		const currentClass = this;
		//?if the marker is already been dropped then just change its position and exit
		if (this.markerInstances) {
			this.markerInstances.setPosition({
				lat: latitude,
				lng: longitude
			});
			return;
		}
		//*define marker options
		const markerOptions = {
			position: { lat: latitude, lng: longitude },
			map: this.mapsInstances,
			icon: icon,
			title: "Lat: " + latitude + ", Lng: " + longitude,
			draggable: true,
			animation: google.maps.Animation.DROP,
			optimized: true
		}
		//*initialize the marker and save it's instance to be used later on this class
		this.markerInstances = new google.maps.Marker(markerOptions);
		//*define a click event to control what will happen when the user clicks on the marker
		this.markerInstances.addListener('click', function () {
			//*in this case we just remove the marker
			currentClass.removeMarker();
		});
	}

	//*remove current dropped marker
	removeMarker():void {
		this.markerInstances.setMap(null);
		this.markerInstances = null;
	}

	//?this method will calculate distance between current user location and the dropped marker
	calculateDistance():void {
		//* abort if the user dose not locate his current location yet
		if (!this.currentCoords) {
			this.infoWindow("Please locate your current coordinates");
			return;
		}
		//* abort if the user did not drop a marker yet
		if (!this.markerInstances) {
			this.infoWindow("Please put a marker to calculate distance from");
			return;
		}
		//catch first point which is current user location coordinates
		const firstPoint = <Coords> this.currentCoords
		//catch first point which is the marker location coordinates
		const secondPoint = <Coords> {
			lat: this.markerInstances.position.lat(),
			lng: this.markerInstances.position.lng(),
		}
		//*use distance class to calculate distance
		const distanceHelper = new DistanceHelper(firstPoint, secondPoint);
		const distance = distanceHelper.getCrowDistance();
		//view the distance in the info window
		this.infoWindow(distance + " KM");

	}

	//*open street view in the marker location
	streetView(streetViewDrawingArea: HTMLElement):boolean {
		//* abort if the user did not drop a marker yet
		if (!this.markerInstances) {
			this.infoWindow("Please put a marker to show street view");
			return false;
		}
		//initialize the panorama object to view the street view
		const panorama = new google.maps.StreetViewPanorama(
			streetViewDrawingArea,
			{
				position: { lat: this.markerInstances.position.lat(), lng: this.markerInstances.position.lng() },
				pov: {
					heading: 34,
					pitch: 10,
				},
			}
		);

		//use the panorama object in our current map
		this.mapsInstances.setStreetView(panorama);
		return true;
	}

}