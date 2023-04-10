import { Box, Button, Flex } from "theme-ui";
import { useState, useEffect } from "react";
import styles from "../styles/components.module.css";
const CollectionBanner = ({ contractData }) => {
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          height: "16rem",
          alignItems: "center",
          background: "#333333",
          width: "100%",
          overflow: "hidden",
          mt: ".5rem",
          backgroundImage: `url(${contractData?.collection?.banner_image_url})`,
          backgroundPosition: "50% 50%",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
        // className={}
      >
        {contractData?.asset_contract?.total_supply > 0 && (
          <Button
            sx={{
              color: "black",
              background: "primary_b",
              p: ".5rem 3rem",
              fontSize: "1.4rem !important",
              mr: "8rem",
            }}
          >
            <Flex sx={{ flexDirection: "column" }}>
              <Box sx={{ fontSize: "1rem" }}>
                {contractData.asset_contract.total_supply}
                {contractData?.assets?.length}
                REMAINING
              </Box>
              MINT NOW!
            </Flex>
          </Button>
        )}
      </Box>
    </div>
  );
};

export default CollectionBanner;
