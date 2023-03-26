import React, { useEffect, useRef } from 'react'
    
/**
* useClickOutside()
* ---
* 
* useState that returns if CSS prop/value is valid
* 
* @param {string} cssProp - the prop used to validate the value
* @param {string} cssString - the prop used to validate the value
* @returns A stateful value and true if valid

* @example
* 
*/

const useClickOutside= (callback: Function, customRef?: any) => {
    const tempRef = useRef<any>(null)
    const ref = customRef || tempRef
    
    const handler = (e: Event) => {
        (ref.current !== null && !ref.current.contains(e.target)) && callback(e)
    }
    
    useEffect(() => {
        window.addEventListener('click', handler)
        return () => window.removeEventListener('click', handler)
    })


    return ref

}

export default useClickOutside