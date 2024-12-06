import Skeleton from "react-loading-skeleton";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    // <div
    //   style={{
    //     color: "black",
    //     backgroundColor: "white",
    //     height: "100vh",
    //     width: "100%",
    //   }}
    // >
    <Skeleton width={"100vw"} height={"100vh"} />

      // loading...
    // </div>
  );
}
