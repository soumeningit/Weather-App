window.addEventListener("offline", function () {
    console.log("Disconnected...so sad!!!")
});
document.addEventListener("DOMContentLoaded", function () {
    const defaultTab = document.querySelector("[tab-yourWeather]");
    const searchTAb = document.querySelector("[tab-searchWeather]");
    const userContainer = document.querySelector(".weather-container");

    const grantlocationTab = document.querySelector(".grant-location-container");
    const searchFrom = document.querySelector("[data-Search]");
    const userInfoContainer = document.querySelector(".weather-Info");
    const loaderImg = document.querySelector(".loading-Section");

    const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
    let currentTab = defaultTab;
    currentTab.classList.add("updatedTab");
    getFromSessionStorage();

    defaultTab.addEventListener("click", () => {
        console.log("clicked on default tab");
        switchTab(defaultTab);
    });

    searchTAb.addEventListener("click", () => {
        console.log("clicked on search tab");
        switchTab(searchTAb);
    });

    function switchTab(clickedTab) {
        if (currentTab != clickedTab) {
            currentTab.classList.remove("updatedTab");
            currentTab = clickedTab;
            currentTab.classList.add("updatedTab");

            if (!searchFrom.classList.contains("active")) {
                userInfoContainer.classList.remove("active");
                grantlocationTab.classList.remove("active");
                error.classList.remove("active");
                searchFrom.classList.add("active");
                // locationTabData.classList.add("active");
            }
            else {
                searchFrom.classList.remove("active");
                userContainer.classList.remove("active");
                error.classList.remove("active");
                getFromSessionStorage();
            }
        }
    }

    function getFromSessionStorage() {
        const localCoOrdinates = sessionStorage.getItem("user-coordinates");
        if (!localCoOrdinates) {
            grantlocationTab.classList.add("active");
        }
        else {
            const coordinates = JSON.parse(localCoOrdinates);
            fetchUserWeatherInfo(coordinates);
        }
    }

    const error = document.querySelector(".errorImage");
    const errorContainer = document.querySelector(".error-container");

    async function fetchUserWeatherInfo(coordinates) {
        const { lat, lon } = coordinates;
        loaderImg.classList.add("active");
        grantlocationTab.classList.remove("active");
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
            // console.log("Response : " + response);
            if (!response.ok) {
                throw new Error('Internal server error'); // Throw error for internal server error
            }
            const data = await response.json();
            loaderImg.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderData(data);
            // console.log(data);
        }
        catch (e) {
            console.log("Error fetching weather data:", e);
            loaderImg.classList.remove("active");
            userInfoContainer.classList.remove("active");
            error.classList.add("active");

        }
    }
    function displayErrorImage() {
        errorImage.style.display = 'block';
    }

    function renderData(data) {
        const city = document.querySelector("[city-Name]");
        const flag = document.querySelector("[fla-Img]");
        const weatherDesc = document.querySelector("[weather-info]");
        const weatherDescImg = document.querySelector("[weather-img]");
        const temp = document.querySelector("[weather-tempr]");
        const windSpeed = document.querySelector("[data-WindsSpeed]");
        const humidity = document.querySelector("[data-Humidity]");
        const cloud = document.querySelector("[data-Cloud]");

        city.innerText = data?.name;
        flag.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
        weatherDesc.innerText = data?.weather?.[0]?.description;
        weatherDescImg.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
        temp.innerText = `${data?.main?.temp} °C`;
        windSpeed.innerText = `${data?.wind?.speed} m/s`;
        humidity.innerText = `${data?.main?.humidity}%`;
        cloud.innerText = `${data?.clouds?.all}%`;
    }

    // const grantLocationButton = document.querySelector("[grant-locatio-btn]");
    const grantLocationButton = document.querySelector("[grant-location-btn]");

    grantLocationButton.addEventListener("click", getLocation);

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError, {
                enableHighAccuracy: true,
                timeout: 10000, // 10 seconds
                maximumAge: 0
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("Location permission denied. Please enable location access in your browser.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable. Please check your internet connection or GPS.");
                break;
            case error.TIMEOUT:
                alert("The request to get your location timed out. Please try again.");
                break;
            case error.UNKNOWN_ERROR:
            default:
                alert("An unknown error occurred while fetching the location.");
                break;
        }
    }

    function showPosition(position) {

        const userCoordinates = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
        }

        sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
        fetchUserWeatherInfo(userCoordinates);

    }

    const searchInput = document.querySelector("[data-searchInput]");

    searchFrom.addEventListener("submit", (e) => {
        userInfoContainer.classList.remove("active");
        e.preventDefault();
        let cityName = searchInput.value;

        if (cityName === "")
            return;
        else
            fetchSearchWeatherInfo(cityName);
    })

    async function fetchSearchWeatherInfo(city) {
        loaderImg.classList.add("active");
        userInfoContainer.classList.remove("active");
        grantlocationTab.classList.remove("active");

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );
            if (!response.ok) {
                throw new Error("Internal Error..");
            }
            const data = await response.json();
            loaderImg.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderData(data);
        }
        catch (e) {
            userInfoContainer.classList.remove("active");
            loaderImg.classList.remove("active");
            searchFrom.classList.remove("active");
            error.classList.add("active");
            errorContainer.classList.add("active");
        }
    }

    const refreshBtn = document.querySelector(".refresh-button");
    refreshBtn.addEventListener("click", () => {
        window.location.reload();
    })
})
