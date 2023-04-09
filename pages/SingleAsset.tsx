import { Box, Button, Flex, Image } from "theme-ui";

const SingleAsset = ({
  animation_url,
  eview,
  token_id,
  assetName,
  username,
  address,
  traits,
  backToFull,
  assetLength,
  image_url,
  currentContract,
  singleAssetAddress,
}) => {
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Flex sx={{ justifyContent: "flex-end" }}>
          <Button onClick={eview}>CLOSE</Button>
        </Flex>

        <Flex
          sx={{
            borderBottom: "2px solid",
            borderColor: "primary_b",
            mb: "3rem",
            justifyContent: "space-between",
            pb: "3rem",
          }}
        >
          <Box sx={{ border: "1px solid transparent", width: "100%" }}>
            <Box sx={{ fontSize: "4rem", fontWeight: "bold" }}>#{token_id}</Box>
            <Box
              sx={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "grey_7",
              }}
            >
              {assetName}
            </Box>
            <Flex sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              <Box sx={{ color: "grey_7", mr: ".5rem" }}>Owner:</Box>
              <Box sx={{ color: "primary_b" }}>
                {username ?? address ? singleAssetAddress : null ?? "..."}
              </Box>
            </Flex>
            <Flex sx={{ flexDirection: "column", mr: "4rem", mt: "3rem" }}>
              {traits.map((tr: any, tr_idx: number) => (
                <Flex
                  key={tr_idx}
                  onClick={() => {
                    backToFull(tr);
                  }}
                  sx={{
                    cursor: "pointer",
                    width: "100%",
                    mb: 2,
                    background: "#222c",
                    p: ".25rem 1rem",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1px solid #333c",
                    transition: ".3s",
                    "&:hover": { background: "#222f" },
                  }}
                >
                  <Flex sx={{ flexDirection: "column" }}>
                    <Box sx={{ color: "grey_7" }}>{tr.trait_type}</Box>
                    <Box>{tr.value}</Box>
                  </Flex>
                  <Box>
                    {parseInt((tr.trait_count / assetLength) * 100 + "")}%
                  </Box>
                </Flex>
              ))}
            </Flex>
          </Box>
          <Box
            sx={{
              border: "1px solid transparent",
              width: "100%",
              pt: "1rem",
            }}
          >
            {animation_url ? (
              <>
                <video
                  style={{
                    width: "100%",
                    zIndex: "10",
                    display: "block",
                    position: "relative",
                    height: animation_url ? "auto" : "0px",
                    transitionDelay: "2s",
                    transition: "1s",
                  }}
                  autoPlay
                  loop
                >
                  <source src={animation_url} type="video/mp4"></source>
                </video>
              </>
            ) : (
              <Image
                src={image_url ?? "http://placekitten.com/200/200"}
                alt=""
                width={200}
                height={200}
                // layout={"responsive"}
                style={{
                  background: "linear-gradient(80deg, #222 45%, #333, #111)",
                  zIndex: "8",
                  transitionDelay: "2s",
                  transition: "1s",
                }}
              />
            )}

            <Flex sx={{ justifyContent: "flex-end", p: "2rem 0" }}>
              <br />
              <a
                href={`https://opensea.io/assets?search[query]=${currentContract}`}
                target="blank"
                style={{
                  background: "#ccc",
                  borderRadius: "50%",
                  backgroundImage: `url(./opensea.png)`,
                  backgroundSize: "80% 80%",
                  backgroundPosition: "50% 40%",
                  backgroundRepeat: "no-repeat",
                  minWidth: "2rem",
                  width: "2rem",
                  height: "2rem",
                  // filter: 'grayscale(1)',
                  margin: ".5rem",
                }}
              />
              <a
                href={`https://etherscan/address/${currentContract}`}
                target="blank"
                style={{
                  background: "#ccc",
                  borderRadius: "50%",
                  backgroundImage: `url(./etherscan.png)`,
                  backgroundSize: "80% 80%",
                  backgroundPosition: "50% 40%",
                  backgroundRepeat: "no-repeat",
                  width: "2rem",
                  height: "2rem",
                  minWidth: "2rem",
                  // filter: 'grayscale(1)',
                  margin: ".5rem",
                }}
              />
              <a
                href={`https://looksrare.org/collections/0x5955373CC1196fD91A4165C4c5c227B30a3948f9/${token_id}`}
                target="blank"
                style={{
                  background: "#ccc",
                  borderRadius: "50%",
                  backgroundImage: `url(./looksrare.png)`,
                  backgroundSize: "90% 70%",
                  backgroundPosition: "50% 40%",
                  backgroundRepeat: "no-repeat",
                  width: "2rem",
                  height: "2rem",
                  minWidth: "2rem",
                  margin: ".5rem",
                }}
              />
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default SingleAsset;
