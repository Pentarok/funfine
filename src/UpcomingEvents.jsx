import React, { useState, useMemo } from "react";
import "./posts.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ThreeDots } from "react-loader-spinner";
import MediaCard from "./Card";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import SearchForm from "./SearchComponent";

const UpcomingEvents = () => {
  const serverUri = import.meta.env.VITE_BACKEND_URL;
  const [sortOrder, setSortOrder] = useState("ascending");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const fetchPosts = async () => {
    const res = await axios.get(`${serverUri}/upcoming/events`);
    if (!res.data) {
      throw new Error("No data returned");
    }
    return res.data;
  };

  const { data: posts, isLoading, error, isError } = useQuery({
    queryKey: ["upcoming"],
    queryFn: fetchPosts,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    staleTime: 10000,
    retry: 2, // Retry failed requests twice
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    return posts
      ? posts.filter((post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];
  }, [posts, searchQuery]);

  // Sort filtered posts based on the sort order
  const sortedPosts = useMemo(() => {
    return filteredPosts.sort((a, b) => {
      const dateA = new Date(a.startDateTime);
      const dateB = new Date(b.endDateTime);
      return sortOrder === "ascending" ? dateA - dateB : dateB - dateA;
    });
  }, [filteredPosts, sortOrder]);

  if (isLoading) {
    return (
      <div className="text-center text-white d-flex justify-content-center align-items-center">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="blue"
          ariaLabel="three-dots-loading"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <p className="text-white text-center">
          An error occurred: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="body-container">
      {/* Search bar */}
      <SearchForm onSearch={setSearchQuery} searchQuery={searchQuery} />

      <h1 className="text-center" style={{ color: "white" }}>
        Upcoming Events
      </h1>

      {/* Sort dropdown */}
      <div className="sort-wrapper text-center">
        <label htmlFor="sortOrder" className="text-white">
          Sort by:
        </label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="ml-2"
        >
          <option value="ascending">Least recent</option>
          <option value="descending">Most recent</option>
        </select>
      </div>

      {/* Event cards */}
      <div className="card-container">
        {sortedPosts.length === 0 ? (
          <div className="no-matches-container">
            <p>No items match your search</p>
          </div>
        ) : (
          sortedPosts.map((event, i) => (
            <MediaCard key={i} event={event} formatDate={formatDate} />
          ))
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default UpcomingEvents;

