import { Box } from "theme-ui";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const CollectionBannerSkeleton = ({ contractData }) => {
  return (
    <>
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
      >
        <Skeleton />
      </Box>
    </>
  );
};

export default CollectionBannerSkeleton;
