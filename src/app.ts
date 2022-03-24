//*import maps helper class
import { Maps } from "./modules/maps.class";

//*grab required HTML elements
const mapsDrawingArea = <HTMLElement> document.querySelector('.maps-container');
const streetViewDrawingArea = <HTMLElement> document.querySelector('.street-view-container');
const closeStreetViewBtn = <HTMLElement> document.querySelector('#close-street-view-btn');
const locateMEBtn = <HTMLElement> document.querySelector('#locate-me-btn');
const distanceBtn = <HTMLElement> document.querySelector('#distance-btn');
const streetViewBtn = <HTMLElement> document.querySelector('#street-view-btn');

//*define a variable to hold maps helper class instances
let map : any;
//* instantiate and draw the map
function initMap() : void {
	const [defaultLatitude, defaultLongitude] : [number, number] = [16.4, 30.09];
	map = new Maps(defaultLatitude, defaultLongitude, mapsDrawingArea);
}
initMap();

//*define locate user current location listener
locateMEBtn.addEventListener('click', function () :void {
	map.getCurrentLocation();
});

//*define calculate distance listener
distanceBtn.addEventListener('click', function () :void {
	map.calculateDistance();
});

//*define street view listener
streetViewBtn.addEventListener('click', function () :void {
	//check if the street view is drowned successfully
	if (map.streetView(streetViewDrawingArea)) {
		//then show the close button
		closeStreetViewBtn.classList.remove('d-none');
		//and show the drawing area on the screen
		streetViewDrawingArea.classList.remove('d-none');
	};
});

//*define listener on maps click to drop a marker
map.mapsInstances.addListener('click', function (e:any): void {
	const [latitude, longitude] : [number,number] = [e.latLng.lat(), e.latLng.lng()];
	map.putMarker(latitude, longitude);
});

//*define listener to close street view
closeStreetViewBtn.addEventListener('click', function () :void {
	//hide the street view area and close button
	closeStreetViewBtn.classList.add('d-none');
	streetViewDrawingArea.classList.add('d-none');
})
