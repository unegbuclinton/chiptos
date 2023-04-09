import Link from "next/link";
import { useRouter } from "next/router";
import useDataStore from "store/dataStore";
import {
  Flex,
  Box,
  Button,
  IconButton,
  NavLink,
  Select,
  useThemeUI,
} from "theme-ui";
import Icons from "@lib/icons";
import env from "@lib/env";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DarkMode } from "@emotion-icons/material/DarkMode";
import { Sun } from "@emotion-icons/evaicons-solid/Sun";

const Navbar = () => {
  const store_loading = useDataStore((s) => s.loading);
  const store_allLoaded = useDataStore((s) => s.allLoaded);
  const [darkMode, setDarkMode] = useState(true);

  const router = useRouter();
  const { pathname } = router;

  const context = useThemeUI();
  const { theme, colorMode, setColorMode } = context;

  useEffect(() => {
    setDarkMode(colorMode === "dark" ? true : false);
  }, [colorMode]);

  const [toggle, setToggle] = useState(false);
  return (
    <Flex
      sx={{
        background: "grey_15",
        color: "grey_0",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <nav
        style={{
          display: "flex",
          alignContent: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ padding: ".8rem" }}>
          {toggle ? (
            <Box
              sx={{
                backgroundImage: `url('/ChiptosLogo_3.svg')`,
                width: "8rem",
                height: "100%",
                border: "1px solid transparent",
                backgroundPosition: "center center",
                backgroundSize: "cover",
              }}
            />
          ) : (
            <Box
              sx={{
                backgroundImage: `url('/ChiptosLogo_2.svg')`,
                width: "8rem",
                height: "100%",
                border: "1px solid transparent",
                backgroundPosition: "center center",
                backgroundSize: "cover",
              }}
            />
          )}
          {/* ({store_allLoaded ? 'all loaded' : store_loading ? 'loading initial' : 'loading rest'}) */}
        </Box>
        <Flex
          className="nav-links"
          sx={{
            alignItems: "center",
            padding: ".8rem",
            "& *": { marginRight: ".5rem" },
          }}
        >
          <NavLink href={env.STORE_URL}>Buy A Chipto</NavLink>
          <Button
            variant="iconLight"
            onClick={() => {
              setToggle((prev) => !prev);
              setColorMode && setColorMode(darkMode ? "light" : "dark");
            }}
          >
            {darkMode ? (
              <Sun style={{ margin: "0" }} size="20" />
            ) : (
              <DarkMode style={{ margin: "0" }} size="20" />
            )}
          </Button>
          {/* <NavLink href='#about'>About</NavLink> */}
          {/* <NavLink href='#gallery'>Gallery</NavLink> */}
          {/* <NavLink href='#docs'>Docs</NavLink> */}
          {/* <NavLink href='#members'>Members v</NavLink> */}
          {/* <Select 
              defaultValue="Members"
              sx={{fontFamily: 'inherit', fontSize: '.8rem', fontWeight: 'bold', background: 'transparent', padding: 0, margin: 0, width: '6rem', marginTop: '-.1rem', borderRadius: 0, cursor: 'pointer', border: '0px', borderBottom: '3px solid transparent', '&:hover':{borderColor: 'grey_0'}}}
              >
                <option >Members</option>
                <option value='ayo'>Ayo</option>
              </Select> */}
          <NavLink sx={{ mx: 0 }} href={env.TWITTER_URL}>
            <Icons.twitter size="20" />
          </NavLink>
          <NavLink sx={{ mx: 0 }} href={env.INSTAGRAM_URL}>
            <Icons.instagram size="20" />
          </NavLink>
          <NavLink sx={{ mx: 0 }} href={env.DISCORD_URL}>
            <Icons.discord size="26" />
          </NavLink>
        </Flex>
      </nav>
    </Flex>
  );
};

export default Navbar;
