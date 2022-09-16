import {useState, useEffect} from "react"
import City from "./City.js"

function Cities (props) {
    const [cities, setCities] = useState([])
    const url = "http://localhost:5050/cities"
    useEffect(() => {
      fetch(url)
        .then((resp) => { return resp.json() })
        .then((jsonedResp) => { setCities(jsonedResp)})
    }, [])

    return (
        <>
        Cities Component
        <hr />
        {
            cities.map((aCity) => {
            return <City aCity={aCity} />
            })
        }
        </>
    )
}

export default Cities;