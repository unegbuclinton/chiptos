import type { NextPage } from "next";
import Head from "next/head";
import { useW3MContext } from "../hooks/useW3M";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
// import styles from "../components/components.scss";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Button,
  Box,
  Flex,
  Card,
  Input,
  Grid,
  useThemeUI,
  NavLink,
  Spinner,
} from "theme-ui";
import AddressBlock from "@components/AddressBlock";
import { Search } from "@emotion-icons/evaicons-solid/Search";
import { CloseOutline } from "@emotion-icons/evaicons-outline/CloseOutline";
import cdMap from "@lib/contractDataMap";
import axios from "axios";
import env from "@lib/env";
import useDataStore, { E_Views } from "store/dataStore";
import { Trustedshops } from "emotion-icons/simple-icons";
import useDebounceEffect from "hooks/useDebounceEffect";
import useClickOutside from "hooks/useClickOutside";
import { Network, Alchemy } from "alchemy-sdk";
import contractDataMap from "../lib/contractDataMap";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Icons from "../lib/icons";
import SingleAsset from "./SingleAsset";
import CollectionBanner from "@components/CollectionBanner";
import CollectionBannerSkeleton from "@components/CollectionBannerSkeleton";

const settings = {
  apiKey: env.ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};
const MenuItemVariants: Variants = {
  hide: { opacity: 0 },
  show: { opacity: 1 },
};
const alchemy = new Alchemy(settings);

const trimAddress = (addr: string) =>
  addr.substring(0, 6) + "..." + addr.substring(34, 40);

const Home: NextPage = () => {
  const W3 = useW3MContext();

  const store_loading = useDataStore((s) => s.loading);
  const store_contractData = useDataStore((s) => s.contractData);
  const store_personalData = useDataStore((s) => s.personalData);
  const store_currentContract = useDataStore((s) => s.currentContract);
  const store_currentView = useDataStore((s) => s.currentView);
  const store_allLoaded = useDataStore((s) => s.allLoaded);
  const store_singleAsset = useDataStore((s) => s.singleAsset);

  const store_setCurrentContract = useDataStore((s) => s.setCurrentContract);
  const store_setCurrentView = useDataStore((s) => s.setCurrentView);
  const store_setLoading = useDataStore((s) => s.setLoading);
  const store_setPersonalData = useDataStore((s) => s.setPersonalData);
  const store_setSingleAsset = useDataStore((s) => s.setSingleAsset);

  const [filterOpen, setFilterOpen] = useState(true);

  //~
  const [searchValue, setSearchValue] = useState("");
  const [assetFilteredArray, setAssetFilteredArray] = useState<any[]>([]);
  const [assetStartingIndex, setAssetStartingIndex] = useState(0);
  const [assetVisibleArray, setAssetVisibleArray] = useState<any[]>([]);
  const [remainder, setRemainder] = useState(0);

  const context = useThemeUI();
  const { theme, colorMode, setColorMode } = context;

  const RESULTS_PER_PAGE = 25;
  const searchFocusRef = useRef(false);

  const ignoreFilterKeys = ["permalink"];

  const ignoreFilterVals = ["googleusercontent"];

  const [showSingleAsset, setShowSingleAsset] = useState(false);

  //&
  const AssetCard = (props: any) => {
    const { asset, idx } = props;

    return (
      <Box
        className="token-card"
        sx={{
          p: "4px",
          border: "2px solid transparent",
          "&:hover": {
            transform: "scale(1.1)",
            transition: "all .2s ease-in-out",
          },
        }}
        onClick={() => {
          store_setSingleAsset(asset);
          store_setCurrentView(E_Views.SINGLE);
          setShowSingleAsset(true);
        }}
      >
        <Box
          sx={{
            p: "4px",
            border: "2px solid transparent",
            "&:hover": {
              border: "2px solid",
              borderColor: "primary_b",
            },
          }}
        >
          <motion.div
            key="assets"
            variants={MenuItemVariants}
            initial="hide"
            animate="show"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src={asset.image_preview_url || "http://placekitten.com/200/200"}
              alt=""
              width={200}
              height={200}
              layout="responsive"
              style={{
                background: "linear-gradient(80deg, #222 45%, #333, #111)",
              }}
            />
          </motion.div>
        </Box>
        <h4
          className="asset_img"
          style={{ margin: 0, padding: 0, marginTop: "2px" }}
        >
          #{asset.token_id}
        </h4>
      </Box>
    );
  };

  //&
  const FilterSidebar = (props: any) => {
    const [openIndex, setOpenIndex] = useState(-1);
    const focRef = useRef(null);

    const AccordionItem = (props: any) => {
      const { heading, items, openIndex, setOpenIndex, idx } = props;

      return (
        <motion.div
          key="assets"
          variants={MenuItemVariants}
          initial="hide"
          animate="show"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Box
            sx={{
              borderBottom: "1px solid",
              borderColor: "grey_4",
              fontSize: ".8rem",
              p: 1,
            }}
          >
            <Button
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
              onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
            >
              <div>{heading}</div> +
            </Button>
            {openIndex === idx &&
              items &&
              items.map((item: string) => (
                <Button
                  key={item}
                  onClick={() => setSearchValue(item)}
                  sx={{
                    color: "grey_15",
                    fontWeight: "normal",
                    fontSize: ".7rem !important",
                    width: "100%",
                    textAlign: "left",
                    justifyContent: "flex-start",
                  }}
                >
                  {item}
                </Button>
              ))}
          </Box>
        </motion.div>
      );
    };

    const handleSearchChange = (e: any) => {
      setSearchValue(e.target.value ?? "");
      searchFocusRef.current = true;
    };

    useClickOutside(() => {
      searchFocusRef.current = false;
    }, focRef);

    useEffect(() => {
      //@ts-ignore
      focRef.current && focRef.current.focus();
    }, []);

    return (
      <motion.div
        key="assets"
        variants={MenuItemVariants}
        initial="hide"
        animate="show"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Flex
          sx={{
            border: "1px solid transparent",
            width: filterOpen ? "20rem" : "3rem",
            flexDirection: "column",
            p: "3px",
            maxHeight: "50rem",
            overflowY: "auto",
            mr: "1rem",
          }}
        >
          {filterOpen ? (
            <>
              <Flex
                sx={{
                  alignItems: "center",
                  border: "0px solid",
                  borderBottom: "1px solid",
                  borderColor: "primary_b",
                  "&:hover": { background: "primary_t" },
                }}
              >
                <Input
                  sx={{
                    width: "16rem",
                    border: "0px solid transparent",
                    fontFamily: "monospace",
                    pl: ".8rem",
                  }}
                  value={searchValue}
                  onChange={handleSearchChange}
                  ref={focRef}
                  placeholder="Search"
                />
                <Button p="0" sx={{ "&:hover": { outline: "none" } }}>
                  <Search size="20" />
                </Button>
                {/* <Button p='0' onClick={handleClose}><CloseOutline size='30'/></Button> */}
              </Flex>
              {Object.entries(
                store_contractData[store_currentContract].trait_map
              ).map((trait: any, idx: number) => (
                <AccordionItem
                  key={idx}
                  idx={idx}
                  heading={trait[0]}
                  items={trait[1]}
                  openIndex={openIndex}
                  setOpenIndex={setOpenIndex}
                />
              ))}
            </>
          ) : (
            <>
              <Button
                p="0"
                sx={{ borderRadius: "50%", width: "2rem", height: "2rem" }}
                onClick={() => setFilterOpen(true)}
              >
                <Search size="26" />
              </Button>
            </>
          )}
        </Flex>
      </motion.div>
    );
  };

  //&
  const handleConnected = async (addr: string) => {
    store_setCurrentView(E_Views.PERSONAL);
    store_setLoading(true);

    let ensNames: string[] = [];

    let data = await alchemy.nft.getNftsForOwner(addr, {
      contractAddresses: Object.values(contractDataMap),
    });

    const ownershipData: any = {};
    const existingContracts = Object.values(contractDataMap);

    data.ownedNfts.forEach((nft: any) => {
      if (nft.title && nft.title !== "") {
        ensNames.push(nft.title);
      }
      if (existingContracts.includes(nft.contract.address)) {
        if (nft.contract.address in ownershipData) {
          ownershipData[nft.contract.address].push(nft.tokenId);
        } else {
          ownershipData[nft.contract.address] = [nft.tokenId];
        }
      }
    });

    console.log("ownership:", ownershipData);

    let personalData: any = {};

    Object.entries(store_contractData).forEach((ctr: any, ctr_idx: number) => {
      let CTR_NAME = ctr[0];
      let CTR_DATA = ctr[1];

      let arrayOfOwnedTokenIds = ownershipData[contractDataMap[CTR_NAME]] ?? [];

      personalData[CTR_NAME] = {
        ensNames,
        numOwned: arrayOfOwnedTokenIds.length,
        owned: arrayOfOwnedTokenIds,
        // ownershipData,
        total: store_contractData[store_currentContract].assets.length,
        collectionMap: {},
        assets: [],
      };

      if (
        !(contractDataMap[CTR_NAME] in ownershipData) ||
        !arrayOfOwnedTokenIds
      ) {
        console.log(`CONNECT | User owns no tokens in ${CTR_NAME}`);
        return;
      }

      console.log(
        `CONNECT | owned tokens in "${CTR_NAME}" : ${arrayOfOwnedTokenIds}`
      );

      // personalData[CTR_NAME].assets = CTR_DATA.assets.filter((ast:any) =>
      // arrayOfOwnedTokenIds.includes(ast.token_id)
      // )

      CTR_DATA.assets.forEach((ast: any, ast_idx: number) => {
        if (arrayOfOwnedTokenIds.includes(ast.token_id)) {
          // console.log(`CONNECT | Found owned token: ${ast.token_id}`)
          personalData[CTR_NAME].assets.push(ast);

          let trait = ast?.traits?.find(
            (x: any) => x?.trait_type?.toLowerCase() === "type"
          )?.value;
          if (!trait) return;
          if (trait in personalData[CTR_NAME].collectionMap) {
            personalData[CTR_NAME].collectionMap[trait].quantity +=
              personalData[CTR_NAME].collectionMap[trait].quantity;
            personalData[CTR_NAME].collectionMap[trait].tokenIds.push(
              ...arrayOfOwnedTokenIds
            );
          } else {
            personalData[CTR_NAME].collectionMap[trait] = {
              quantity: 1,
              tokenIds: arrayOfOwnedTokenIds,
            };
          }
        }
      });
    });

    // console.log('CONNECT | personalData:', personalData)

    store_setPersonalData(personalData);

    store_setLoading(false);
  };

  //&
  const filterArray = () => {
    // console.log(`filtering: "${searchValue}"...`)
    if (
      !store_contractData ||
      !store_currentContract ||
      !store_contractData[store_currentContract]
    )
      return;

    if (!searchValue || searchValue === "") {
      let filteredData = store_contractData[store_currentContract].assets;
      setAssetFilteredArray(filteredData);
      sliceArray(filteredData);
      return;
    }

    let tokenIdList: any = [];

    store_contractData[store_currentContract].assets.forEach((ast: any) => {
      const recurse = (obj: any) => {
        if (!obj) return false;
        // console.log('searching in:', obj)

        Object.entries(obj).forEach(([KEY, VAL]: any) => {
          if (typeof VAL === "object") {
            recurse(VAL);
          }
          if (ignoreFilterKeys.includes(KEY) || ignoreFilterVals.includes(VAL))
            return;

          let searchReg = new RegExp(searchValue, "gmi");

          if (searchReg.test(KEY) || searchReg.test(VAL)) {
            // console.log('found searchValue:', searchValue, ' @ ', ast.token_id)
            tokenIdList.push(ast.token_id);
          }
        });
      };

      recurse(ast);
    });

    let filteredData = store_contractData[store_currentContract].assets.filter(
      (ast: any) => tokenIdList.includes(ast.token_id)
    );

    console.log("filtered:", filteredData);
    setAssetFilteredArray(filteredData);
    sliceArray(filteredData);
  };

  //&
  const sliceArray = (filteredData?: any) => {
    // console.log(`slicing: ${assetStartingIndex} => ${assetStartingIndex + RESULTS_PER_PAGE}`)

    const data = filteredData ?? assetFilteredArray;
    const sliced = data.slice(
      assetStartingIndex,
      assetStartingIndex + RESULTS_PER_PAGE
    );

    setAssetVisibleArray(sliced);
    // console.log('sliced:', sliced.length)
    setRemainder(sliced.length);
  };

  //&
  const filterArrayPersonal = () => {
    // console.log(`FILTER PERSONAL | "${searchValue}"...`)
    if (!store_personalData) {
      console.log("FILTER PERSONAL | no personalData");
      return;
    }

    if (!store_currentContract) {
      console.log("FILTER PERSONAL | no currentContract");
      return;
    }

    if (!store_personalData[store_currentContract]) {
      console.log(
        "FILTER PERSONAL | no personalData[currentContract] =>",
        store_currentContract
      );
      return;
    }

    if (!searchValue || searchValue === "") {
      let filteredData =
        store_personalData[store_currentContract]?.assets ?? [];
      setAssetFilteredArray(filteredData);
      sliceArray(filteredData);
      return;
    }
    let tokenIdList: any = [];

    // console.log(`FILTER PERSONAL | personalData[${store_currentContract}] =>`, store_personalData[store_currentContract])

    store_personalData[store_currentContract] &&
      store_personalData[store_currentContract].assets.forEach((ast: any) => {
        const recurse = (obj: any) => {
          if (!obj) return false;
          // console.log('FILTER PERSONAL |searching in:', obj)

          Object.entries(obj).forEach(([KEY, VAL]: any) => {
            if (typeof VAL === "object") {
              recurse(VAL);
            }
            if (
              ignoreFilterKeys.includes(KEY) ||
              ignoreFilterVals.includes(VAL)
            )
              return;

            let searchReg = new RegExp(searchValue, "gmi");

            if (searchReg.test(KEY) || searchReg.test(VAL)) {
              // console.log('found searchValue:', searchValue, ' @ ', ast.token_id)
              tokenIdList.push(ast.token_id);
            }
          });
        };

        recurse(ast);
      });

    // console.log('FILTER PERSONAL | tokenIdList:', tokenIdList)

    let filteredData = store_personalData[store_currentContract].assets.filter(
      (ast: any) => tokenIdList.includes(ast.token_id)
    );

    // console.log('FILTER PERSONAL | filteredData:', filteredData)
    setAssetFilteredArray(filteredData);
    sliceArray(filteredData);
  };

  //&
  useEffect(() => {
    if (W3.connected && W3.address) {
      handleConnected(W3.address);
    }
  }, [W3.connected, W3.address, store_allLoaded, store_currentContract]);

  //&
  useEffect(() => {
    if (
      store_contractData &&
      store_currentContract &&
      store_contractData[store_currentContract]
    ) {
      console.log("contract or contractData changed...");
      const asts =
        store_personalData[store_contractData]?.assets ??
        store_contractData[store_currentContract].assets;
      // console.log('found assets:', asts.length)
      setAssetFilteredArray(asts);
      sliceArray(asts);
    } else {
      console.log("no contract data?");
    }
  }, [
    store_currentContract,
    store_contractData,
    store_loading,
    store_allLoaded,
    store_personalData,
    store_currentView,
  ]);

  //&
  useEffect(() => {
    sliceArray();
  }, [assetStartingIndex]);

  //&
  useEffect(() => {
    setAssetStartingIndex(0);
  }, [store_currentView, store_currentContract]);

  //&
  useEffect(() => {
    store_currentView === E_Views.FULL ? filterArray() : filterArrayPersonal();
  }, [
    searchValue,
    store_currentView,
    store_currentContract,
    store_personalData,
    store_allLoaded,
  ]);

  //&
  const handlePaginate = async (direct: string) => {
    if (direct === "next") {
      console.log({
        type: "next",
        assetStartingIndex,
        A: assetFilteredArray.length - RESULTS_PER_PAGE,
        B: assetStartingIndex + RESULTS_PER_PAGE,
      });
      if (
        assetStartingIndex <= assetFilteredArray.length - RESULTS_PER_PAGE &&
        remainder === RESULTS_PER_PAGE
      ) {
        console.log(
          "setting startingIndex:",
          assetStartingIndex + RESULTS_PER_PAGE
        );
        setAssetStartingIndex((n) => n + RESULTS_PER_PAGE);
      }
    } else {
      if (assetStartingIndex >= RESULTS_PER_PAGE) {
        console.log(
          "setting startingIndex:",
          assetStartingIndex - RESULTS_PER_PAGE
        );
        setAssetStartingIndex((n) => n - RESULTS_PER_PAGE);
      }
    }
  };

  // //&
  // if(store_loading || !Object.entries(store_contractData).length){
  //   return (
  //     <div>
  //     <Head>
  //       <title>Chiptos Collector</title>
  //       <meta name="description" content="Chiptos collection management tool" />
  //       <link rel="icon" href="/favicon.ico" />
  //     </Head>
  //     <main>

  //       <Flex sx={{
  //         position: 'absolute',
  //           width: '100vw',
  //           height: '100vh',
  //           marginTop: '-1rem',
  //           background: 'black',
  //           zIndex: 2,
  //           pointerEvents: 'auto',
  //           opacity: '1',
  //           transition: '1s',
  //           justifyContent:'center',
  //           alignItems:'center'
  //         }}>
  //           <Box sx={{fontSize: '9rem'}}>LOADING...</Box>

  //         </Flex>
  //       </main>

  //     </div>
  //   )
  // }

  const CollectionAccordion = (props: any) => {
    let [imgUrl, setImgUrl] = useState("");
    let [tokenIds, setTokenIds] = useState([]);
    let [pointer, setPointer] = useState(0);

    let { type } = props;

    useEffect(() => {
      if (store_currentContract && store_contractData[store_currentContract]) {
        // if(t in store_personalData[store_currentContract].collectionMap){
        // return ` ${t}-(${store_personalData[store_currentContract].collectionMap[t]}) `
        setTokenIds(
          store_personalData[store_currentContract].collectionMap[type]
            ?.tokenIds ?? []
        );
        // }else{
        // return ` ${t}-(0) `
        // }
      }
      // store_contractData[store_currentContract].assets.find((ast:any) => ast.traits['Type'] === type).image_url
    }, [store_contractData, store_currentContract]);

    useEffect(() => {
      let assets = store_contractData[store_currentContract].assets;

      if (!tokenIds.length) {
        let assetWithTrait = assets.find(
          (ast: any) =>
            ast.traits.find((t: any) => t.trait_type === "Type").value === type
        );

        setImgUrl(assetWithTrait.image_preview_url);
      } else {
        setImgUrl(
          assets.find((ast: any) => ast.token_id === tokenIds[pointer])
            .image_preview_url
        );
      }
    }, [tokenIds, pointer]);

    const handlePointer = (isIncrement: boolean) => {
      if (isIncrement) {
        if (pointer < tokenIds.length) {
          pointer++;
        } else {
          pointer = 0;
        }
      } else {
        if (pointer > 0) {
          pointer--;
        } else {
          pointer = tokenIds.length;
        }
      }
    };

    return (
      <Box
        className="token-card"
        sx={{
          height: "auto",
          width: "16.7rem",
          p: "4px",
          mb: "6rem",
          border: "2px solid transparent",
          "&:hover": { border: "2px solid", borderColor: "primary_b" },
        }}
      >
        {tokenIds.length ? (
          tokenIds.map((token: any, idx: number) => (
            <>
              <Box
                key={idx}
                sx={{
                  background: "linear-gradient(80deg, #222 45%, #333, #111)",
                  backgroundImage: `url(${imgUrl})`,
                  backgroundSize: "cover",
                  // display: 'flex',
                  justifyContent: "center",
                  alignItems: "center",
                  height: "16rem",
                  width: "16rem",
                }}
              />

              <Flex
                sx={{
                  border: "0px solid white",
                  height: "0rem",
                  // overflow: 'hidden',
                  flexDirection: "column",
                }}
              >
                {tokenIds.map((x: any, i: any) => (i === pointer ? "x" : "o"))}
                <Box
                  sx={{
                    width: "100%",
                    textAlign: "left",
                    lineHeight: "1.4rem",
                  }}
                >
                  <div
                    style={{
                      margin: 0,
                      padding: 0,
                      fontSize: "1.4rem",
                      fontWeight: "bold",
                    }}
                  >
                    #{tokenIds[pointer]}
                  </div>
                  <div style={{ color: "grey", margin: 0, padding: 0 }}>
                    {type}
                  </div>
                </Box>
              </Flex>
            </>
          ))
        ) : (
          <Box
            sx={{
              background: "linear-gradient(80deg, #222 45%, #333, #111)",
              backgroundImage: `url(${imgUrl})`,
              backgroundSize: "cover",
              filter: "grayscale(1)",
              opacity: ".8",
              // height: '100%',
              // display: 'flex',
              justifyContent: "center",
              alignItems: "center",
              height: "16rem",
              width: "16rem",
              // maxWidth: '16rem',
            }}
          >
            <Flex
              sx={{
                height: "inherit",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "1.4rem",
              }}
            >
              <Box
                sx={{
                  fontSize: "1.4rem",
                  fontWeight: "bold",
                  color: "white",
                  position: "absolute",
                }}
                className="layered-text-small"
              >
                {type.toUpperCase()}
              </Box>
            </Flex>
          </Box>
        )}
      </Box>
    );
  };

  const bareImageLoader = (config: any) => {
    return config.src;
  };

  //&
  const [show, setShow] = useState(true);
  const [shouldRender, setRender] = useState(show);
  console.log(shouldRender);
  useEffect(() => {
    if (show) setRender(true);
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) setRender(false);
  };
  return (
    <div>
      <Head>
        <title>Chiptos Collector</title>
        <meta name="description" content="Chiptos collection management tool" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {/* //~ Loading wall */}
        {/* <Flex sx={{
          position: 'absolute',
          width: '100vw',
          height: '100%',
          marginTop: '-1rem',
          background: 'black',
          zIndex: 2,
          pointerEvents: store_loading ? 'auto' : 'none',
          opacity: store_loading ? '1' : '0',
          transition: '1s',
          justifyContent:'center',
          alignItems:'center',
          transitionDelay: '.5s',
        }}>
          <Box sx={{fontSize: '9rem'}}>LOADING...</Box>
        </Flex> */}

        {/* //~ Contract list menu */}
        <Flex
          sx={{
            justifyContent:
              store_currentView !== E_Views.SINGLE
                ? "space-between"
                : "flex-end",
            width: "100%",
          }}
        >
          {store_loading ? (
            <>
              <Skeleton />
            </>
          ) : (
            store_currentView !== E_Views.SINGLE && (
              <>
                <Flex sx={{ border: "1px solid", borderColor: "grey_5" }}>
                  {Object.entries(store_contractData).map(
                    (ctr: any, idx: number) => (
                      <Button
                        key={idx}
                        sx={{
                          borderColor:
                            ctr[0] === store_currentContract
                              ? "primary_b"
                              : "transparent",
                          margin: 0,
                        }}
                        onClick={() => {
                          store_setCurrentContract(ctr[0]);
                          setShow((prev) => !prev);
                        }}
                      >
                        {ctr[0].toUpperCase()}
                      </Button>
                    )
                  )}
                  <a
                    href={`https://opensea.io/assets?search[query]=${contractDataMap[store_currentContract]}`}
                    target="blank"
                    style={{
                      backgroundImage: `url(./opensea.png)`,
                      backgroundSize: "80% 80%",
                      backgroundPosition: "center center",
                      backgroundRepeat: "no-repeat",
                      width: "2rem",
                      height: "2rem",
                    }}
                  ></a>
                </Flex>
                <Flex
                  sx={{
                    border: "1px solid",
                    borderColor:
                      W3.connected && W3.address ? "transparent" : "grey_5",
                  }}
                >
                  {W3.connected && W3.address ? (
                    <AddressBlock />
                  ) : (
                    <Button
                      sx={{ borderColor: "primary_b", m: 0 }}
                      onClick={() => W3.connect()}
                    >
                      CONNECT
                    </Button>
                  )}
                </Flex>
              </>
            )
          )}
        </Flex>

        {/* //~ Large name and phrase */}
        <Flex
          sx={{
            width: "100%",
            height: "9rem",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          <Box
            sx={{
              fontSize: "9rem",
              whiteSpace: "nowrap",
              width: "inherit",
              fontWeight: "900",
              color: "secondary_b",
              margin: "0",
              padding: "0",
              marginLeft: "-7rem",
              marginTop: "0%",
              position: "absolute",
              zIndex: 1,
              opacity: 1,
              letterSpacing: "-.5rem",
            }}
          >
            {store_currentContract.toUpperCase()}
          </Box>

          {new Array(25)
            .fill(store_currentContract.toUpperCase())
            .map((x: string, idx: number) => (
              <Box
                key={idx}
                sx={{
                  fontSize: "9rem",
                  whiteSpace: "nowrap",
                  width: "inherit",
                  fontWeight: "900",
                  color: "transparent",
                  margin: "0",
                  padding: "0",
                  marginLeft: "-7rem",
                  transition: "1s",
                  transitionDelay: "1s",
                  transform: store_loading
                    ? "translateY(0rem)"
                    : "translateY(" + (idx + 1) * 8 + "rem)",
                  position: "absolute",
                  zIndex: 1,
                  opacity: 0.4 - idx * 0.05,
                  letterSpacing: "-.5rem",
                  textStrokeWidth: "1px",
                }}
                className="layered-text"
              >
                {store_currentContract.toUpperCase()}
              </Box>
            ))}
          <Box
            sx={{
              zIndex: 2,
              color: "grey_15",
              maxWidth: "25rem",
              fontSize: ".8rem",
              fontWeight: "bold",
            }}
          >
            <Box
              sx={{
                display: "inline-block",
                background: colorMode === "dark" ? "primary_b" : "black",
                color: colorMode === "dark" ? "grey_0" : "primary_b",
                padding: "0 .2rem",
                marginRight: ".3rem",
              }}
            >
              {store_currentContract}
            </Box>
            <Box sx={{ display: "inline", lineHeight: "1.5rem" }}>
              {store_contractData[store_currentContract] &&
                store_contractData[store_currentContract].collection
                  .description}
            </Box>
          </Box>
        </Flex>

        {/* //~ Current collection banner */}
        {store_currentView !== E_Views.SINGLE &&
          store_currentView !== E_Views.COLLECTION && (
            <Box
              sx={{
                height: "16rem",
                width: "100%",
                pt: "1rem",
                mb: "1rem",
                borderTop: "2px solid",
                borderColor: "primary_b",
              }}
            >
              {!store_loading ? (
                <CollectionBanner
                  contractData={store_contractData[store_currentContract]}
                />
              ) : (
                <>
                  <CollectionBannerSkeleton
                    contractData={store_contractData[store_currentContract]}
                  />
                </>
              )}
            </Box>
          )}

        {store_loading || !Object.entries(store_contractData).length ? (
          <>
            {/* //~ sidebar and AssetCard map ----------- SKELETON */}
            <Flex
              sx={{
                border: "1px solid transparent",
                width: "100%",
                mt: "1rem",
              }}
            >
              <Flex
                sx={{
                  border: "1px solid transparent",
                  width: filterOpen ? "20rem" : "3rem",
                  flexDirection: "column",
                  p: "3px",
                  maxHeight: "50rem",
                  overflowY: "auto",
                  mr: "1rem",
                }}
              >
                <Flex
                  sx={{
                    alignItems: "center",
                    border: "0px solid",
                    borderBottom: "1px solid",
                    borderColor: "primary_b",
                    "&:hover": { background: "primary_t" },
                  }}
                >
                  <Skeleton />
                  <Button p="0" sx={{ "&:hover": { outline: "none" } }}>
                    <Search size="20" />
                  </Button>
                </Flex>
                <Skeleton
                  count={8}
                  style={{ height: "1.5rem", marginTop: ".5rem" }}
                />
              </Flex>

              <Flex
                sx={{
                  border: "1px solid transparent",
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Grid
                  p="2"
                  sx={{ border: "1px solid transparent", width: "104%" }}
                  gap={0}
                  columns={[3, 4, 5]}
                >
                  {new Array(RESULTS_PER_PAGE)
                    .fill("nothing")
                    .map((ass: any, idx: number) => (
                      <Box
                        key={idx}
                        className="token-card"
                        sx={{
                          p: "4px",
                          border: "2px solid transparent",
                          "&:hover": {
                            border: "2px solid",
                            borderColor: "primary_b",
                          },
                        }}
                      >
                        <Skeleton
                          style={{ height: "9rem", marginBottom: ".5rem" }}
                        />
                        <Skeleton style={{ height: "1.5rem" }} />
                      </Box>
                    ))}
                </Grid>

                <Flex sx={{ justifyContent: "space-between", mb: ".5rem" }}>
                  <Button
                    variant="secondary"
                    disabled={true}
                    sx={{ minWidth: "12rem" }}
                    onClick={() => handlePaginate("prev")}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={true}
                    sx={{ minWidth: "12rem" }}
                    onClick={() => handlePaginate("next")}
                  >
                    Next
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </>
        ) : (
          <>
            {/* //~ view menu and account stats */}
            {store_currentView !== E_Views.SINGLE &&
              store_personalData[store_currentContract] &&
              W3.connected &&
              W3.address &&
              Object.entries(
                store_personalData[store_currentContract].collectionMap
              ).length && (
                <Flex
                  sx={{
                    width: "100%",
                    justifyContent: "space-between",
                    borderBottom: "2px solid",
                    borderColor: "primary_b",
                    pb: "1.5rem",
                    mb: "1rem",
                    mt: "1rem",
                  }}
                >
                  <Box style={{ flex: 1 }}>
                    <Box sx={{ fontSize: "1.6rem", fontWeight: "bold" }}>
                      {store_personalData[store_currentContract].ensNames[0] ||
                        W3.address.substring(0, 6) +
                          "..." +
                          W3.address.substring(34, 40)}
                    </Box>
                    <Box>
                      {store_personalData[store_currentContract].numOwned} /
                      {store_personalData[store_currentContract].total}
                    </Box>

                    {Object.keys(
                      store_personalData[store_currentContract].collectionMap
                    ).length > 0 && (
                      <Box sx={{ maxWidth: "26rem", mt: 2, color: "orange" }}>
                        <Flex
                          sx={{
                            justifyContent: "space-between",
                            "& > *": { margin: 0 },
                          }}
                        >
                          <p>
                            {
                              Object.entries(
                                store_personalData[store_currentContract]
                                  .collectionMap
                              ).length
                            }
                            /
                            {
                              store_contractData[store_currentContract]
                                .trait_map["Type"].length
                            }
                          </p>
                          <p style={{ color: "grey" }}>TYPES COLLECTED</p>
                        </Flex>

                        <Box
                          sx={{
                            width: "100%",
                            background: "grey_4",
                            height: "10px",
                            borderRadius: "2px",
                          }}
                        >
                          <Box
                            sx={{
                              width:
                                Math.round(
                                  (Object.entries(
                                    store_personalData[store_currentContract]
                                      .collectionMap
                                  ).length /
                                    store_contractData[store_currentContract]
                                      .trait_map["Type"].length) *
                                    100
                                ) + "%",
                              backgroundImage:
                                "linear-gradient(90deg, red, darkorange, yellow)",
                              height: "10px",
                              borderRadius: "2px",
                            }}
                          />
                        </Box>
                      </Box>
                    )}
                  </Box>
                  <Flex
                    sx={{
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      sx={{
                        width: "100%",
                        borderColor:
                          store_currentView === E_Views.FULL
                            ? "primary_b"
                            : "transparent",
                        margin: 0,
                      }}
                      onClick={() =>
                        store_currentView !== E_Views.FULL &&
                        store_setCurrentView(E_Views.FULL)
                      }
                    >
                      FULL COLLECTION
                    </Button>
                    <Button
                      sx={{
                        width: "100%",
                        borderColor:
                          store_currentView === E_Views.PERSONAL
                            ? "primary_b"
                            : "transparent",
                        margin: 0,
                      }}
                      onClick={() =>
                        store_currentView !== E_Views.PERSONAL &&
                        store_setCurrentView(E_Views.PERSONAL)
                      }
                    >
                      MY COLLECTION
                    </Button>
                    {Object.keys(
                      store_contractData[store_currentContract].trait_map
                    ).some((x) => x.toLowerCase() === "type") && (
                      <Button
                        sx={{
                          width: "100%",
                          borderColor:
                            store_currentView === E_Views.COLLECTION
                              ? "primary_b"
                              : "transparent",
                          margin: 0,
                        }}
                        onClick={() =>
                          store_currentView !== E_Views.COLLECTION &&
                          store_setCurrentView(E_Views.COLLECTION)
                        }
                      >
                        CHIPTOS TYPES
                      </Button>
                    )}
                  </Flex>
                </Flex>
              )}

            {/* //~ sidebar and AssetCard map */}
            {store_currentView !== E_Views.SINGLE &&
              store_currentView !== E_Views.COLLECTION && (
                <Flex
                  sx={{
                    border: "1px solid transparent",
                    width: "100%",
                    mt: "1rem",
                  }}
                >
                  <FilterSidebar />

                  <Flex
                    sx={{
                      border: "1px solid transparent",
                      width: "100%",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    {!assetVisibleArray.length ? (
                      <Flex
                        sx={{
                          width: "100%",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{}}>
                          {!store_allLoaded ? (
                            <Skeleton />
                          ) : store_currentView === E_Views.FULL ? (
                            searchValue ? (
                              <Skeleton />
                            ) : (
                              <Skeleton />
                            )
                          ) : searchValue ? (
                            `No owned NFT's found with '${searchValue}' in '${store_currentContract}'`
                          ) : (
                            `You do not own any NFT's in '${store_currentContract}'`
                          )}
                        </Box>
                      </Flex>
                    ) : (
                      <Grid
                        p="2"
                        sx={{ border: "1px solid transparent", width: "104%" }}
                        gap={0}
                        columns={[3, 4, 5]}
                      >
                        {assetVisibleArray.map((ass: any, idx: number) => (
                          <AssetCard key={idx} idx={idx} asset={ass} />
                        ))}
                      </Grid>
                    )}

                    <Flex sx={{ justifyContent: "space-between", mb: ".5rem" }}>
                      <Button
                        variant="secondary"
                        disabled={assetStartingIndex === 0}
                        sx={{ minWidth: "12rem" }}
                        onClick={() => handlePaginate("prev")}
                      >
                        Previous
                      </Button>
                      {/* <p>{assetStartingIndex}</p> */}
                      <Button
                        variant="secondary"
                        disabled={
                          assetStartingIndex >
                          assetFilteredArray.length - RESULTS_PER_PAGE
                        }
                        sx={{ minWidth: "12rem" }}
                        onClick={() => handlePaginate("next")}
                      >
                        Next
                      </Button>
                    </Flex>
                  </Flex>
                </Flex>
              )}

            {/* //~ single asset view */}
            {store_currentView === E_Views.SINGLE && store_singleAsset && (
              <SingleAsset
                eview={() => store_setCurrentView(E_Views.FULL)}
                animation_url={store_singleAsset?.animation_url}
                token_id={store_singleAsset.token_id}
                assetName={store_singleAsset.name}
                traits={store_singleAsset.traits}
                backToFull={(tr) => {
                  setSearchValue(tr.value);
                  store_setCurrentView(E_Views.FULL);
                }}
                assetLength={
                  store_contractData[store_currentContract].assets.length
                }
                image_url={store_singleAsset.image_url}
                currentContract={contractDataMap[store_currentContract]}
                singleAssetAddress={store_singleAsset?.owner?.address}
                username={store_singleAsset.owner?.user?.username}
                address={store_singleAsset.owner?.address}
                show={showSingleAsset}
              />
            )}

            {/* //~ Collection view */}
            {store_currentView === E_Views.COLLECTION &&
              Object.keys(
                store_personalData[store_currentContract].collectionMap
              ).length > 0 && (
                <>
                  {/* <p>Collection</p> */}
                  {/* <pre>{JSON.stringify(store_personalData[store_currentContract].collectionMap, null, 2)}</pre> */}

                  {/* <pre>{Object.entries(store_personalData[store_currentContract].collectionMap).length} / {store_contractData[store_currentContract].trait_map['Type'].length}</pre> */}

                  {/* {store_contractData[store_currentContract].trait_map['Type'].map((t:string) => {
              if(t in store_personalData[store_currentContract].collectionMap){
                return ` ${t}-(${store_personalData[store_currentContract].collectionMap[t]}) `
              }else{
                return ` ${t}-(0) `
              }
            })} */}

                  {/* {store_contractData[store_currentContract].trait_map['Type'].map((t:string, idx:number) => <CollectionAccordion key={idx} type={t} />)} */}
                  <Box
                    sx={{
                      width: "100%",
                      border: "1px solid transparent",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Grid
                      p="1"
                      sx={{ border: "1px solid transparent", width: "100%" }}
                      gap={6}
                      columns={[2, 3, 4]}
                    >
                      {store_contractData[store_currentContract].trait_map[
                        "Type"
                      ].map((t: any, idx: number) => (
                        <CollectionAccordion key={idx} type={t} />
                      ))}
                    </Grid>
                  </Box>
                </>
              )}
          </>
        )}

        {/* <pre style={{maxWidth: '80vw', wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}>`total `X: {store_contractData['Chiptos X'] && store_contractData['Chiptos X'].assets.length}</pre> */}
        {/* <pre style={{maxWidth: '80vw', wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}>total 512: {store_contractData['Chiptos 512'] && store_contractData['Chiptos 512'].assets.length}</pre> */}
        {/* <pre style={{maxWidth: '80vw', wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}>all loaded: {store_allLoaded+''}</pre> */}
        {/* <pre style={{maxWidth: '80vw', wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}>trait_map 512: {store_contractData['Chiptos 512'] && JSON.stringify(store_contractData['Chiptos 512'].trait_map, null, 2)}</pre> */}
        {/* <pre style={{maxWidth: '80vw', wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}>{JSON.stringify(store_contractData[store_currentContract], null, 2)}</pre> */}
        {/* <hr /> */}
        {/* <pre style={{maxWidth: '80vw', wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}>{JSON.stringify(store_personalData, null, 2)}</pre> */}

        {/* Does the trait map include "Type" */}
        {/* {Object.keys(store_contractData[store_currentContract].trait_map).some(x => x.toLowerCase() === 'type') ? 'TRUE' : 'FALSE'}
         */}
        {/* {<pre>{JSON.stringify(store_contractData[store_currentContract].assets.filter(ast => ast.traits.filter(t => t.trait_type === 'Type')?.value?.toLowerCase() === 'daemon'), null, 2)}</pre>} */}
      </main>
    </div>
  );
};

export default Home;
