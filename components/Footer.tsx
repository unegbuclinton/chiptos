import Link from 'next/link'
import {Flex, Box, Button, NavLink, useThemeUI} from 'theme-ui'
import Icons from '@lib/icons'
import env from '@lib/env'

const Footer = () => {
  const context = useThemeUI();
    const { theme, colorMode, setColorMode } = context;
    return(
      <Box sx={{background: 'grey_2', color: 'grey_12'}} as='footer'>
            <div className='footer-row'>
              <a href={env.HOME_URL}>
                <Box sx={{backgroundImage: `url('/ChiptosLogo_2.svg')`, width: '8rem', height: '2rem', border: '1px solid transparent', backgroundPosition: 'center center', backgroundSize: 'cover', filter: colorMode == 'dark' ? 'invert(1)' : 'invert(0)'}}/>
              </a>
              {/* <div className='footer-links'>
                <Link href='#'>About</Link>
                <Link href='#'>Contact</Link>
                <Link href='#'>Media</Link>
              </div> */}
            {/* </div>
            <div className='footer-row extra-top'> */}
              <p className='copyright'>&#169; 2022 Chiptos LP</p>
              <Flex sx={{justifyContent: 'space-evenly', minWidth: '10rem'}}>
                <NavLink style={{cursor:'pointer'}} href={env.TWITTER_URL}><Icons.twitter size='26'/></NavLink>
                {/* <NavLink href={env.FACEBOOK_URL}><Icons.facebook size='26'/></NavLink> */}
                <NavLink href={env.INSTAGRAM_URL}><Icons.instagram size='26'/></NavLink>
                <NavLink href={env.DISCORD_URL}><Icons.discord size='26'/></NavLink>
              </Flex>
              {/* <div className='footer-meta'>
                <Link href='#'>Terms</Link>
                <Link href='#'>FAQ</Link>
                <Link href='#'>Privacy</Link>
              </div> */}
            </div>
        </Box>
    )
  }
  
  
  
export default Footer