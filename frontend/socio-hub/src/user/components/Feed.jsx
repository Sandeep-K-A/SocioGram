import Suggestions from "../components/Suggestions";
import Post from "../components/Post";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiInstance from "../../utils/apiInstance";
import InfiniteScroll from "react-infinite-scroll-component";

function Feed() {
  const user = useSelector((state) => state.user);
  const userId = user.userId;
  const token = user.token;
  const id = user.id;
  const [feedPosts, setFeedPosts] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 3;
  const getUserFeedPosts = async (pageNumber) => {
    try {
      const response = await apiInstance.get(
        `/user-feed-posts/${userId}/${id}?page=${pageNumber}&perPage=${perPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { success, message, userFeedPosts } = response.data;
      if (success) {
        setFeedPosts((prevPosts) =>
          pageNumber === 1 ? userFeedPosts : [...prevPosts, ...userFeedPosts]
        );
      } else {
        console.log(message);
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };
  const fetchData = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    getUserFeedPosts(nextPage);
  };
  useEffect(() => {
    getUserFeedPosts(page);
  }, []);
  console.log(feedPosts);
  return (
    <div className="flex">
      <div className="w-70">
        <div>
          {feedPosts?.map((post) => (
            <Post
              key={post.postId}
              postId={post.postId}
            />
          ))}
        </div>
      </div>
      <div className="w-30 mr-32">
        <Suggestions />
      </div>
      <InfiniteScroll
        dataLength={feedPosts.length} //This is important field to render the next data
        next={fetchData}
        hasMore={true}
        // loader={<h4>Loading...</h4>}
        // endMessage={
        //   <p style={{ textAlign: "center" }}>
        //     <b>Yay! You have seen it all</b>
        //   </p>
        // }
        // below props only if you need pull down functionality
        // refreshFunction={this.refresh}
        // pullDownToRefresh
        // pullDownToRefreshThreshold={50}
        // pullDownToRefreshContent={
        //   <h3 style={{ textAlign: "center" }}>&#8595; Pull down to refresh</h3>
        // }
        // releaseToRefreshContent={
        //   <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
        // }
      >
        {/* {items} */}
      </InfiniteScroll>
    </div>
  );
}

export default Feed;
