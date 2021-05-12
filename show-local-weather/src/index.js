import React from 'react'
import {render} from 'react-dom'
    
import fetch from 'isomorphic-fetch'
    
import {IconCodes, WeatherImages} from './Data.js'

class ShowLocalWeather extends React.Component {
  
    constructor() {
        super();
        
        this.state = {
            yourLocation: false,
            currentLocation: null,
            loaded: false,
            name: null,
            sys: {
                country: null
            },
            main: {
                temp: null
            },
            weather: [],
            scale: 'F'
        }
    }
    
    componentWillMount() {
        
        fetch('http://ipinfo.io/json')
            .then((response) => {
                if(response.status >= 400) {
                     throw new Error("Bad response from server");
                }
                return response.json()
            })
            .then((data) => {
                const loc = data.loc.split(",")
                const lat = loc[0]
                const lon = loc[1]
                
                this.setState({
                    lat: lat,
                    lon: lon,
                    yourLocation: true
                })
                
                fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=54937af86172459301c5769096638251`)
                    .then((res) => {
                        if(res.status >= 400) {
                            throw new Error("Bad response from server");
                        }
                        return res.json()
                    })
                    .then((json) => {
                        
                        this.setState(json)
                        this.setState({
                            loaded: true
                        })
                    })

            })
    }
    
    setYourLocation() {
        const {lat, lon} = this.state
        
        fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=54937af86172459301c5769096638251`)
            .then((res) => {
                if(res.status >= 400) {
                    throw new Error("Bad response from server");
                }
                return res.json()
            })
            .then((json) => {
                
                this.setState(json)
                this.setState({
                    yourLocation: true,
                    loaded: true
                })
            })
    }
    
    changeLocation(q) {
        const {currentLocation} = this.state
        if(q != currentLocation) {
            this.setState({
                currentLocation: q,
                yourLocation: false
            })
            fetch(`http://api.openweathermap.org/data/2.5/weather?q=${q}&appid=54937af86172459301c5769096638251`)
                        .then((res) => {
                            if(res.status >= 400) {
                                throw new Error("Bad response from server");
                            }
                            return res.json()
                        })
                        .then((json) => {
                            
                            this.setState(json)
                        })
        }
    }
    
    changeScale() {
        const { scale } = this.state
        
        this.setState({scale: scale == 'F' ? 'C' : 'F' })
    }
    
    getWeatherIcon(code) {
        const prefix = 'wi wi-'
        
        if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
            return prefix +  'day-' + IconCodes[code].icon
        }
        
        return prefix + IconCodes[code].icon
    }
    
    render () {
        const {yourLocation, loaded, name, sys, weather, scale, main} = this.state
        const description = weather.length ? weather[0]['description'] : ''
        const icon = weather.length ? this.getWeatherIcon(weather[0].id) : ''
        const degrees = {
            F: Math.round(main.temp * 9 / 5 - 459.67),
            C: Math.round(main.temp - 273.15)
        }
        
        const weatherBg = {
            backgroundImage: weather.length && WeatherImages[ weather[0].main  ] ? 'url(' + WeatherImages[ weather[0].main ] + ')'  : 'url(https://images.unsplash.com/uploads/1412455906842d646f1ce/7bf17d33?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&s=837e793aadb85695fb96fee1c0365243&w=1080)'
        }
        
        return (
            <div className="weather-bg" style={weatherBg}> 
                {
                loaded ? 
                (
                <div>
                    <div className="gradient"></div>

                    <div className="city-details">{name}, {sys.country}</div>

                    <div className="weather-details">
                        <span className="weather-info">
                            <i className={icon}/>
                            {description}
                        </span>
                        <span className="degrees-info" onClick={() => this.changeScale()}>{degrees[scale]} &deg;{scale} </span>
                    </div>
                </div>
                ) : 

                    (<div className="opaque"/>)
                }
                <div className="location-selector">
                    <svg viewBox="0 0 48 48">
                    <path d="M43.818,33.546C45.215,30.657,46,27.418,46,24c0-12.131-9.869-22-22-22C11.87,2,2,11.869,2,24s9.869,22,22,22 c8.673,0,16.189-5.048,19.769-12.358c0.02-0.028,0.043-0.059,0.061-0.087L43.818,33.546z M34.338,37.456 c0.852-1.887,1.523-4.017,1.979-6.335c3.09-0.982,5.645-2.262,7.355-3.613c-0.324,1.82-0.896,3.551-1.68,5.166 C40.953,34.069,38.471,36.075,34.338,37.456z M6.007,32.674c-0.713-1.472-1.27-3.033-1.604-4.678 c1.715,1.372,4.249,2.559,7.345,3.428c0.454,2.201,1.102,4.229,1.916,6.032C9.529,36.075,7.048,34.069,6.007,32.674z M13.475,29.796 C13.168,27.96,13,26.016,13,24c0-0.529,0.021-1.049,0.044-1.568c2.922,0.899,6.349,1.455,9.956,1.544v7.003 C19.399,30.906,16.188,30.463,13.475,29.796z M33.215,13.115c0.775,2.161,1.324,4.607,1.592,7.236 c-2.709,0.898-6.053,1.526-9.807,1.623v-7.003C28.09,14.835,30.902,14.086,33.215,13.115z M25,12.973V4.092 c3,0.495,5.658,3.182,7.479,7.181C30.391,12.151,27.832,12.838,25,12.973z M34.277,10.41C33.33,8.346,32.164,6.6,30.84,5.23 c2.205,0.807,4.236,1.975,6.002,3.459C36.201,9.239,35.338,9.837,34.277,10.41z M15.521,11.271C17.342,7.272,20,4.587,23,4.092 v8.881C20.168,12.838,17.612,12.15,15.521,11.271z M23,14.972v7.003c-3.755-0.097-7.098-0.725-9.808-1.623 c0.268-2.629,0.817-5.076,1.593-7.238C17.1,14.084,19.913,14.834,23,14.972z M13.723,10.408c-1.06-0.572-1.923-1.17-2.564-1.72 c1.766-1.483,3.797-2.651,6.002-3.458C15.836,6.599,14.669,8.346,13.723,10.408z M23,32.989v5.986 c-2.543-0.063-4.792-0.356-6.753-0.805c-0.979-1.771-1.773-3.878-2.333-6.212C16.674,32.559,19.757,32.926,23,32.989z M23,40.975 v2.934c-1.912-0.315-3.684-1.518-5.19-3.388C19.393,40.776,21.129,40.932,23,40.975z M25,43.908v-2.934 c1.871-0.043,3.605-0.198,5.189-0.454C28.684,42.391,26.912,43.593,25,43.908z M25,38.976v-5.989 c3.234-0.079,6.348-0.539,9.141-1.246c-0.561,2.424-1.377,4.604-2.389,6.431C29.789,38.619,27.541,38.912,25,38.976z M25,30.974 v-6.998c3.605-0.089,7.033-0.645,9.955-1.544C34.979,22.951,35,23.471,35,24c0,1.936-0.16,3.803-0.443,5.574 C31.799,30.344,28.561,30.886,25,30.974z M36.678,28.912C36.883,27.336,37,25.696,37,24c0-0.767-0.023-1.521-0.066-2.266 c2.742-1.079,4.861-2.473,6.037-4.023C43.629,19.691,44,21.801,44,24C44,25.196,41.219,27.316,36.678,28.912z M41.957,15.254 c-0.209,1.386-2.105,3.042-5.207,4.369c-0.309-2.676-0.902-5.152-1.715-7.366c1.385-0.729,2.488-1.503,3.273-2.202 C39.789,11.573,41.018,13.33,41.957,15.254z M9.692,10.055c0.785,0.698,1.888,1.471,3.273,2.2c-0.813,2.214-1.407,4.691-1.715,7.368 c-3.102-1.327-4.998-2.983-5.209-4.369C6.983,13.329,8.211,11.573,9.692,10.055z M5.029,17.709c1.176,1.553,3.295,2.947,6.036,4.025 C11.021,22.479,11,23.233,11,24c0,1.803,0.135,3.538,0.366,5.205C6.725,27.729,4,25.624,4,24C4,21.801,4.371,19.689,5.029,17.709z M9.726,37.982c1.467,0.74,3.2,1.419,5.235,1.941c0.672,1.091,1.423,2.035,2.226,2.855C14.347,41.745,11.801,40.101,9.726,37.982z M30.814,42.779c0.803-0.82,1.553-1.765,2.225-2.855c2.029-0.521,3.762-1.195,5.227-1.934C36.193,40.105,33.65,41.746,30.814,42.779 z"/>
                    </svg>
                    
                    <ul className="world-locations">
                        <li onClick={() => this.changeLocation('London,UK')}>London, UK</li>
                        <li onClick={() => this.changeLocation('New York,US')}>New York, US</li>
                        <li onClick={() => this.changeLocation('Paris,France')}>Paris, France</li>
                        <li onClick={() => this.changeLocation('Berlin,Germany')}>Berlin, Germany</li>
                        <li onClick={() => this.changeLocation('Tokyo,Japan')}>Tokyo, Japan</li>
                        <li onClick={() => this.changeLocation('Sydney,Australia')}>Sydney, Australia</li>
                        <li onClick={() => this.changeLocation('Buenos Aires,Argentina')}>Buenos Aires, Argentina</li>
                        <li onClick={() => this.changeLocation('Toronto,Canada')}>Toronto, Canada</li>
                        <li onClick={() => this.changeLocation('San Francisco,US')}>San Francisco, US</li>
                    </ul>
                    { !yourLocation &&  <span className="your-location" onClick={() => this.setYourLocation()}>your location</span> }
                </div>
            </div>
        )
    }
}

render(<ShowLocalWeather/>, document.getElementById('app'));
