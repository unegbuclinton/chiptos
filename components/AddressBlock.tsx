import { useW3MContext } from "hooks/useW3M"
import {Flex} from 'theme-ui'
import Blockies from 'react-blockies'

const AddressBlock = () => {
    const W3 = useW3MContext()

    return(
        <Flex>
            <Flex sx={{
                flexDirection: 'column',
                alignItems: 'flex-end'
            }}>
                <small style={{padding:'0 .2rem', margin:0, fontSize: '.7rem'}}>{W3.address}</small>
                <button onClick={()=>W3.disconnect()} style={{fontSize: '.7rem',background:'none', border: '0px solid white', color: 'grey', padding: '0 .3rem', margin: 0, cursor: 'pointer'}}>Disconnect</button>
            </Flex>
            <Blockies
                seed={W3.address} 
                size={7} 
                scale={4} 
                // color="#dfe" 
                // bgColor="#ffe"
                // spotColor="#abc" 
                className="identicon"
            />
        </Flex>
    )
}

export default AddressBlock