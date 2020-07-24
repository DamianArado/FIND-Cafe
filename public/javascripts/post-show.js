mapboxgl.accessToken = 'pk.eyJ1IjoiaHVtYXl1bjciLCJhIjoiY2tjcnVyM2ZqMDB2MzJycGR5cHIxdDdzaiJ9.sGP4GtIOuiJRLd8QBQFtLQ';

	var map = new mapboxgl.Map({
	  container: 'map',
	  style: 'mapbox://styles/mapbox/light-v9',
	  center: post.coordinates,
	  zoom: 5
	});


	 // create a HTML element for post location/marker
	  var el = document.createElement('div');
	  el.className = 'marker';

	  // make a marker for our location and add to the map
	  new mapboxgl.Marker(el)
	  .setLngLat(post.coordinates)
	  .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
	  .setHTML('<h3>' + post.title + '</h3><p>' + post.location + '</p>'))
	  .addTo(map);

	//toggle edit review form
		$('.toggle-edit-form').on('click',function(){
		//toggle the edit-form button when clicked
		$(this).text()==='Edit'? $(this).text('Cancel') :  $(this).text('Edit');
		
		//toggle the visibility of the edit review form
		$(this).siblings('.edit-review-form').toggle();	
	});

	//Add click listener for clearing of rating from the edit/new form
	$('.clear-rating').click(function(){
		$(this).siblings('.input-no-rate').click();
	});