import { useContext, useState, useEffect } from "react"
import { createContext } from "react"
import {getCurrentUser} from '../lib/appwrite'

const GlobalContext = createContext()

export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = ({children}) => {
    const [participants, setParticipants] = useState(null)

    
    return (
        <GlobalContext.Provider  
          value={{
            participants,
            setParticipants
          }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider