function getWeatherData(weatherAPIKey, ipAPIKey) {
    const ipURL = "https://ipinfo.io?token=" + ipAPIKey;
    fetch(ipURL).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        const state = data.region;
        const lat = data.loc.split(",")[0];
        const lon = data.loc.split(",")[1];
        const weatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + weatherAPIKey;
        fetch(weatherURL).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            data.stateName = state;
            return data;
        }).then(data => {
            stateNameToAbbreviation(data.stateName).then(state => {
                document.querySelector(".location").innerHTML = (data.name + ", " + state + ", " + data.sys.country).toUpperCase().trim();
            }).catch(error => {
                console.error('Error:', error)
            });

            const fahrenheit = Math.round(data.main.temp * 9 / 5 - 459.67);
            document.querySelector(".temp").innerHTML = fahrenheit;
            document.querySelector(".weather-summary").innerHTML = data.weather[0].description.toUpperCase().trim();

            getIconName().then(iconDataMap => {
                const sunriseDate = new Date(data.sys.sunrise * 1000);
                const sunsetDate = new Date(data.sys.sunset * 1000);
                const currentDate = new Date();

                const timeOfDay = (currentDate > sunriseDate && currentDate < sunsetDate) ? "day" : "night";
                const dayWeatherClass = "wi-owm-" + timeOfDay + "-" + data.weather[0].id;
                const weatherClass = "wi-owm-" + data.weather[0].id;

                var svgFileName = "wi-alien.svg";
                if (iconDataMap.has(dayWeatherClass)) {
                     svgFileName = "wi-" + iconDataMap.get(dayWeatherClass) + ".svg";
                } else if (iconDataMap.has(weatherClass)) {
                    svgFileName = "wi-" + iconDataMap.get(weatherClass) + ".svg";
                }

                getIconSVG(svgFileName).then(svg => {
                    document.querySelector(".icon").innerHTML = svg;
                    var svg = document.getElementsByTagName("svg")[0];
                    var bbox = svg.getBBox();
                    var viewBox = [bbox.x, bbox.y, bbox.width, bbox.height].join(" ");
                    svg.setAttribute("viewBox", viewBox);
                }).catch(error => {
                    console.error('Error:', error);
                });
            }).catch(error => {
                console.error('Error:', error);
            });
        }).catch(error => {
            console.error('There was a problem fetching the weather data:', error);
        });
    }).catch(error => {
        console.error('There was a problem fetching the location data:', error);
    });
}

async function stateNameToAbbreviation(stateName) {
    // Convert state name to title case to match the keys in the states object
    const formattedStateName = stateName.toLowerCase().replace(/\b\w/g, function(match) {
        return match.toUpperCase();
    });

    try {
        const response = await fetch("https://atonetti.github.io/my-widgets/weather/json/states.json");
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const states = new Map(Object.entries(data));

        return states.has(formattedStateName) ? states.get(formattedStateName) : 'Unknown';
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return 'Unknown';
    }
}

async function getIconName() {
    try {
        const response = await fetch("https://atonetti.github.io/my-widgets/weather/json/icon_data.json");
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const iconDataMap = new Map(Object.entries(data));

        return iconDataMap;
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return new Map();
    }
}

async function getIconSVG(svgFileName) {
    try {
        const response = await fetch("https://atonetti.github.io/my-widgets/weather/svg/" + svgFileName);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const svg = await response.text();

        return svg;
    } catch (error) {
        console.error('Error reading SVG file:', error);
        return '';
    }
}
