import { useState, useEffect } from "react"
import { useParams } from "react-router"


function Pages(){

    const {id}=useParams()
    console.log(id)
    return(
        <div>

        </div>
    )
}