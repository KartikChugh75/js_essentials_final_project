function searchResult() {
  const keywordInput = document.querySelector('#searchInput').value.toLowerCase().trim();
  console.log('User input:', keywordInput);

  fetch('travel_recommendation.json')
    .then(response => response.json())
    .then(data => {
      console.log('Data loaded:', data);

      const resultsContainer = document.querySelector('#results');
      resultsContainer.innerHTML = '';

      const keyword = keywordInput;

      let placesToShow = [];

      // Match beach-related
      if (['beach', 'beaches'].some(k => keyword.includes(k))) {
        placesToShow = data.beaches;
      }

      // Match temple-related
      else if (['temple', 'temples'].some(k => keyword.includes(k))) {
        placesToShow = data.temples;
      }

      // Match country names or "country/countries" keyword
      else {
        // Flatten all cities from all countries
        const allCities = data.countries.flatMap(country => country.cities);

        // Filter cities based on keyword match
        const filteredCities = allCities.filter(city =>
          city.name.toLowerCase().includes(keyword)
        );

        // If specific cities or countries match, show those
        if (filteredCities.length > 0) {
          placesToShow = filteredCities;
        } else {
          // No match? Just randomize all cities
          placesToShow = getRandomSubset(allCities, 2);
        }
      }

      if (placesToShow.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
      }

      // Show 2 results
      placesToShow.slice(0, 2).forEach(place => {
        const placeHTML = `
          <div class="recommendation">
            <img src="${place.imageUrl}" alt="${place.name}" />
            <h3>${place.name}</h3>
            <p>${place.description || 'No description available.'}</p>
          </div>
        `;
        resultsContainer.insertAdjacentHTML('beforeend', placeHTML);
      });
    })
    .catch(err => console.error('Error fetching data:', err));
}

// Helper: Return n random items from array
function getRandomSubset(array, n) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

function resetResult(){
    document.getElementById("searchInput").value=""
    document.getElementById("results").innerHTML = ""; // clear results
}