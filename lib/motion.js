export let useAnims = true

if (typeof window !== "undefined") {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    
    // if reduced      ?  useAnims false    :  useAnims true
    mediaQuery.matches ? (useAnims = false) : (useAnims = true)
    
    mediaQuery.addEventListener("change", () => {
        mediaQuery.matches ? useAnims=false : useAnims=true
        console.log('▶️', `animation status changed. use animations: ${useAnims}`)

    })
    console.log('▶️', `use animations: ${useAnims}`)
}