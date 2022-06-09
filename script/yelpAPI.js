let yelpRequestURL = "https://api.yelp.com/v3/businesses/search?term=food,restaurants,drink,cafes&location=Denver&categories=food,restaurants,All";
let autocompleteURL = "https://api.yelp.com/v3/autocomplete?text=del&latitude=39.7392&longitude=104.9903";
let apiKey = 'pvzvB7jQZHeR9y2ed-VZ0rPwPWVnYYTMsXP7D4A3downW0uTM62QUVIahorS8voPTS18BK_LL4vc4tzQKba8wOlFgw5KSKu6c-y7kB59sYU0O0kCWDr1uJAlx9SOYnYx';

// ------------------------------------------------------------------------------
function saveSearch(event) 
{
  event.preventDefault();
  // get value from  the choice made on the dropdown box 
  let coordinates = $("#searchSelectD").val().trim().split(";");
  // a little bit of magic to get the full array of business names
  let searchQuery = searchSelectD.options[searchSelectD.selectedIndex].text.split(",")
  // select the most relevant i.e. the first name in the array and convert to a string the URL can read
  searchQuery = searchQuery[0].replaceAll(" ", "-")
  console.log(searchQuery)
  console.log(searchSelectD.options[searchSelectD.selectedIndex].text)
  console.log(coordinates[0]);
  console.log(coordinates[1]);
   
    fetch ("https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=" + searchQuery + "&latitude=" + coordinates[1] + "&longitude=" + coordinates[0],
    {
      method: "GET",
      headers:
      {
        Authorization: `Bearer ${apiKey}`
      }
    })
    .then((result) => 
    {
      console.log(result)
      if (result.ok) 
      {
        result.json().then(function (data) 
        {
          console.log(data)
          console.log(data.businesses[0])
          getReviews(data.businesses[0])
        }
        )}
        else{
          console.log(data.features[0].properties.address);
        } 
      })
  }

// ------------------------------------------------------------------------------
function getReviews(businessInfo)
{
  fetch ("https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/" + businessInfo.alias + "/reviews",
  {
    method: "GET",
    headers:
    {
      Authorization: `Bearer ${apiKey}`
    }
  })
  .then((result) => 
    {
      console.log(result)
      if (result.ok) 
      {
        result.json().then(function (data) 
        {
          modalHandler(businessInfo, data);
          console.log(data);
        }
        )}
      })
}
// ------------------------------------------------------------------------------
//this is to make the api call on the selection of a destination
$('#searchSelectD').change(saveSearch);

// ------------------------------------------------------------------------------
function modalHandler(businessInfo, reviewInfo) 
{
    // Get the modal
  var modal = document.getElementById('myModal');
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  $("#modalReviews").append("<h1>" + businessInfo.name + "</h1>")
  $("#modalReviews").append("<img class='modalImg' src='" + businessInfo.image_url + "' alt ='" + businessInfo.name + " image'>")
  $("#modalReviews").append("<p> Price: " + businessInfo.price + "</p>")
  $("#modalReviews").append("<p> Address: " + businessInfo.location.display_address + "</p>")
  $("#modalReviews").append("<a href='tel:'" + businessInfo.display_phone + "'> " + businessInfo.display_phone + "</a>")
  $("#modalReviews").append("<br>")
  $("#modalReviews").append("<a href='" + businessInfo.url + "'> Yelp Business Listing</a>")
  $("#modalReviews").append("<h5> Reviews: </h5>")
  for (let i = 0; i < reviewInfo.reviews.length; i++) {
    $("#modalReviews").append("<p>" + reviewInfo.reviews[i].text + "<a href ='" + reviewInfo.reviews[i].url + "'> Full Review</a></p>")
  }
  // make modal display 
  modal.style.display = "block";
  
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() 
  {
    modal.style.display = "none";
    $("#modalReviews").empty()
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) 
  {
    if (event.target == modal)
    {
      modal.style.display = "none";
      $("#modalReviews").empty()
    }
  }
}