import React, { useCallback, useEffect, useState, useRef } from "react";
import { ChevronDown, ChevronUp, MapPin, Star } from "lucide-react";
import { useGetAllCategoriesQuery } from "@/src/redux/features/categories/categoriesApi";
import { useGetAllUsersQuery } from "@/src/redux/features/users/userApi";
import { useRouter, useSearchParams } from "next/navigation";
import { debounce } from "lodash";

interface CategorySidebarProps {
  selectedCategory: string | null;
  selectedItem: string | null;
  onCategorySelect: (category: string | null) => void;
  onItemSelect: (item: string | null) => void;
  onServiceFilter: (services: any[]) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategory,
  selectedItem,
  onCategorySelect,
  onItemSelect,
  onServiceFilter,
}) => {
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [location, setLocation] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const { data: getAllCategories } = useGetAllCategoriesQuery(undefined);
  const categories = getAllCategories?.data || [];
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState("");
  const [skipQuery, setSkipQuery] = useState(false);

  // Add state for live suggestions
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Flag for "All Services" selection state
  const [allServicesSelected, setAllServicesSelected] = useState(true);

  // Create a proper ref for tracking transition state
  const isTransitioningRef = useRef(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Check for initial URL params
  useEffect(() => {
    const myServiceParam = searchParams.get("searchTerm");
    const ratingParam = searchParams.get("rating");
    const locationParam = searchParams.get("country");
    const searchTermParam = searchParams.get("searchTerm");

    // If there are any filter params, "All Services" is not selected
    if (myServiceParam || ratingParam || locationParam || searchTermParam) {
      setAllServicesSelected(false);
    } else {
      setAllServicesSelected(true);
    }

    // Initialize filters from URL
    if (myServiceParam) {
      // Find if it's a category or subcategory
      const parentCategory = categories.find(
        (cat) =>
          cat.category_name === myServiceParam ||
          cat.subCategories?.some(
            (sub: any) => sub.subCategory === myServiceParam
          )
      );

      if (parentCategory) {
        if (parentCategory.category_name === myServiceParam) {
          onCategorySelect(myServiceParam);
          onItemSelect(null);
          setOpenCategories([myServiceParam]);
        } else {
          const isSubcategory = parentCategory.subCategories?.some(
            (sub: any) => sub.subCategory === myServiceParam
          );
          if (isSubcategory) {
            onCategorySelect(parentCategory.category_name);
            onItemSelect(myServiceParam);
            setOpenCategories([parentCategory.category_name]);
          }
        }
      } else {
        // It might be a service that doesn't map directly to our categories
        onCategorySelect(myServiceParam);
        onItemSelect(null);
      }
    }

    if (ratingParam) {
      setSelectedRating(Number(ratingParam));
    }

    if (locationParam) {
      setLocation(locationParam);
    }
  }, [categories, searchParams, onCategorySelect, onItemSelect]);

  // Loading state ref for tracking transitions
  const loadingStateRef = useRef(false);

  // Use the updated query to get filtered users data
  const { data: filteredUsers, isLoading: isFilteredDataLoading } =
    useGetAllUsersQuery(
      {
        ...(searchTerm && { searchTerm }),
        ...(selectedItem && { searchTerm: selectedItem }),
        ...(selectedCategory &&
          !selectedItem && { searchTerm: selectedCategory }),
        ...(location && { country: location }),
        ...(selectedRating && { rating: selectedRating }),
      },
      {
        skip: skipQuery,
      }
    );

  // Get all users for the "All Services" view
  const { data: allUsers, isLoading: isAllUsersLoading } = useGetAllUsersQuery(
    {},
    {
      skip: !skipQuery,
    }
  );

  // Get suggestions based on input
  const updateSuggestions = useCallback(
    (input: string) => {
      if (!input.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      // Collect all possible service names from categories and subcategories
      const categoryNames = categories.map((cat) => cat.category_name);
      const subcategoryNames = categories.flatMap(
        (cat) => cat.subCategories?.map((sub: any) => sub.subCategory) || []
      );

      // Add any service names from user data that might not be in categories
      const serviceNames =
        allUsers?.data?.flatMap((user: any) => user.searchTerm || []) || [];

      // Combine all possible sources of service names
      const allServiceNames = [
        ...new Set([...categoryNames, ...subcategoryNames, ...serviceNames]),
      ];

      // Filter for matches
      const matchingSuggestions = allServiceNames.filter(
        (name) => name && name.toLowerCase().includes(input.toLowerCase())
      );

      // Sort by relevance (starting with the search term first)
      matchingSuggestions.sort((a, b) => {
        const aStartsWith = a.toLowerCase().startsWith(input.toLowerCase());
        const bStartsWith = b.toLowerCase().startsWith(input.toLowerCase());

        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        return a.localeCompare(b);
      });

      // Take top results
      setSuggestions(matchingSuggestions.slice(0, 8));
      setShowSuggestions(matchingSuggestions.length > 0);
    },
    [categories, allUsers?.data]
  );

  // Improved transition handling
  const startTransition = useCallback(() => {
    if (!isTransitioningRef.current) {
      isTransitioningRef.current = true;
      setIsTransitioning(true);
    }
  }, []);

  const endTransition = useCallback(() => {
    const timeoutId = setTimeout(() => {
      isTransitioningRef.current = false;
      setIsTransitioning(false);
    }, 300); // Delay for smooth transition
    return () => clearTimeout(timeoutId);
  }, []);

  // Track loading state changes to handle UI transitions
  useEffect(() => {
    const isLoading = isFilteredDataLoading || isAllUsersLoading;

    // If we're transitioning from loading to not loading
    if (loadingStateRef.current && !isLoading) {
      startTransition();
      return endTransition();
    }

    // Update ref with current loading state
    loadingStateRef.current = isLoading;
  }, [
    isFilteredDataLoading,
    isAllUsersLoading,
    startTransition,
    endTransition,
  ]);

  // Update service filter when filtered data changes
  useEffect(() => {
    if (!skipQuery && filteredUsers?.data) {
      onServiceFilter(filteredUsers.data);
    }
  }, [filteredUsers, onServiceFilter, skipQuery]);

  // Update service filter with all users when needed
  useEffect(() => {
    if (skipQuery && allUsers?.data) {
      onServiceFilter(allUsers.data);
    }
  }, [skipQuery, allUsers, onServiceFilter]);

  // Wrapped state update functions with transition handling
  const safeStateUpdate = useCallback(
    (updateFn) => {
      startTransition();

      // Small delay to ensure transition class is applied before state changes
      setTimeout(() => {
        updateFn();
        endTransition();
      }, 50);
    },
    [startTransition, endTransition]
  );

  // Handle rating selection
  const handleRatingSelect = (rating: number) => {
    safeStateUpdate(() => {
      // Reset skipQuery flag when selecting a rating
      setSkipQuery(false);

      // Toggle rating or set new rating
      const newRating = selectedRating === rating ? null : rating;
      setSelectedRating(newRating);

      // Clear category selection when selecting rating
      onCategorySelect(null);
      onItemSelect(null);
      setOpenCategories([]);

      // Update "All Services" selection state
      setAllServicesSelected(newRating === null && !searchTerm && !location);

      // Update URL and trigger API request - removed searchTerm parameter
      debouncedFilter({
        searchTerm,
        location,
        rating: newRating,
      });
    });
  };

  // Toggle category open/closed and handle selection
  // Modify toggleCategory function
  const toggleCategory = (categoryTitle: string) => {
    safeStateUpdate(() => {
      setSkipQuery(false);
      setAllServicesSelected(false);
      setSelectedRating(null);

      const encodedCategoryTitle = encodeURIComponent(categoryTitle);

      setOpenCategories((prev) =>
        prev.includes(categoryTitle)
          ? prev.filter((title) => title !== categoryTitle)
          : [...prev, categoryTitle]
      );

      const currentCategory = categories.find(
        (cat) => cat.category_name === categoryTitle
      );

      if (currentCategory?.subCategories?.length > 0) {
        onCategorySelect(categoryTitle);
        const subCategory = currentCategory.subCategories[0].subCategory;
        const encodedSubCategory = encodeURIComponent(subCategory);
        onItemSelect(subCategory);
        router.push(`/service-result?searchTerm=${encodedSubCategory}`, {
          scroll: false,
        });
      } else {
        onCategorySelect(categoryTitle);
        onItemSelect(null);
        router.push(`/service-result?searchTerm=${encodedCategoryTitle}`, {
          scroll: false,
        });
      }
    });
  };

  // Modify handleItemClick function
  const handleItemClick = (categoryTitle: string, itemTitle: string) => {
    safeStateUpdate(() => {
      setSkipQuery(false);
      setAllServicesSelected(false);
      onCategorySelect(categoryTitle);
      onItemSelect(itemTitle);

      const encodedItemTitle = encodeURIComponent(itemTitle);
      router.push(`/service-result?searchTerm=${encodedItemTitle}`, {
        scroll: false,
      });
    });
  };

  // Modify the initial URL params check in useEffect
  useEffect(() => {
    const myServiceParam = searchParams.get("searchTerm");
    const ratingParam = searchParams.get("rating");
    const locationParam = searchParams.get("country");
    const searchTermParam = searchParams.get("searchTerm");

    if (myServiceParam || ratingParam || locationParam || searchTermParam) {
      setAllServicesSelected(false);
    } else {
      setAllServicesSelected(true);
    }

    if (myServiceParam) {
      const decodedServiceParam = decodeURIComponent(myServiceParam);
      const parentCategory = categories.find(
        (cat) =>
          cat.category_name === decodedServiceParam ||
          cat.subCategories?.some(
            (sub: any) => sub.subCategory === decodedServiceParam
          )
      );

      if (parentCategory) {
        if (parentCategory.category_name === decodedServiceParam) {
          onCategorySelect(decodedServiceParam);
          onItemSelect(null);
          setOpenCategories([decodedServiceParam]);
        } else {
          const isSubcategory = parentCategory.subCategories?.some(
            (sub: any) => sub.subCategory === decodedServiceParam
          );
          if (isSubcategory) {
            onCategorySelect(parentCategory.category_name);
            onItemSelect(decodedServiceParam);
            setOpenCategories([parentCategory.category_name]);
          }
        }
      } else {
        onCategorySelect(decodedServiceParam);
        onItemSelect(null);
      }
    }
    if (ratingParam) {
      setSelectedRating(Number(ratingParam));
    }

    if (locationParam) {
      setLocation(locationParam);
    }
  }, [categories, searchParams, onCategorySelect, onItemSelect]);

  // Check if a category is open
  const isOpen = (categoryTitle: string) =>
    openCategories.includes(categoryTitle);

  // New debounced handler for live suggestions
  const debouncedUpdateSuggestions = useCallback(
    debounce((value) => {
      updateSuggestions(value);
    }, 200), // Quick response for suggestions (200ms)
    [updateSuggestions]
  );

  // Debounced filter function to update URL and trigger API requests
  const debouncedFilter = useCallback(
    debounce(
      (params: {
        searchTerm?: string;
        location?: string;
        rating?: number | null;
      }) => {
        // Reset skipQuery flag when filtering
        setSkipQuery(false);

        // If any filter is active, "All Services" is not selected
        setAllServicesSelected(
          !params.searchTerm && !params.location && !params.rating
        );

        const urlParams = new URLSearchParams();

        // Only add parameters that have values
        if (params.searchTerm)
          urlParams.append("searchTerm", params.searchTerm);
        if (params.location) urlParams.append("country", params.location);
        if (params.rating !== null && params.rating !== undefined)
          urlParams.append("rating", params.rating.toString());

        // Update URL
        if (urlParams.toString()) {
          router.push(`/service-result?${urlParams.toString()}`, {
            scroll: false,
          });
        } else {
          router.push("/service-result", { scroll: false });
        }
      },
      500
    ),
    [router]
  );

  // Handle search input change - modified for live suggestions
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Update live suggestions as user types
    debouncedUpdateSuggestions(value);

    // Show suggestions dropdown if input has content
    setShowSuggestions(value.trim().length > 0);

    // Reset selected index when input changes
    setSelectedIndex(-1);

    // Reset skipQuery flag when searching
    setSkipQuery(false);
    setAllServicesSelected(value === "");

    // Don't immediately filter/update URL while user is typing
    // (we'll do that when they select a suggestion or press Enter)
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    safeStateUpdate(() => {
      // Hide suggestions
      setShowSuggestions(false);

      // Reset skipQuery flag when selecting a suggestion
      setSkipQuery(false);
      setAllServicesSelected(false);

      // Clear search input after selection
      setSearchTerm("");

      // Find if suggestion is a category, subcategory, or service
      let parentCategory = categories.find(
        (cat) => cat.category_name === suggestion
      );

      if (parentCategory) {
        // It's a main category
        onCategorySelect(suggestion);
        onItemSelect(null);
        setOpenCategories([suggestion]);
      } else {
        // Check if it's a subcategory
        parentCategory = categories.find((cat) =>
          cat.subCategories?.some((sub: any) => sub.subCategory === suggestion)
        );

        if (parentCategory) {
          // It's a subcategory
          onCategorySelect(parentCategory.category_name);
          onItemSelect(suggestion);
          setOpenCategories([parentCategory.category_name]);
        } else {
          // It's a service not in our category hierarchy
          onCategorySelect(suggestion);
          onItemSelect(null);
        }
      }

      // Update URL and trigger API request
      const encodedSuggestion = encodeURIComponent(suggestion);
      router.push(`/service-result?searchTerm=${encodedSuggestion}`, {
        scroll: false,
      });
    });
  };

  // Handle location input change
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationSearchTerm(value);
    setSkipQuery(false);

    if (value.trim()) {
      // Filter users based on location search term
      const filteredLocations = allUsers?.data?.filter((user: any) => {
        const { country, city, zipCode } = user.addressInfo || {};
        return (
          country?.toLowerCase().includes(value.toLowerCase()) ||
          city?.toLowerCase().includes(value.toLowerCase()) ||
          zipCode?.includes(value)
        );
      });

      // Get unique locations
      const uniqueLocations = Array.from(
        new Set(
          filteredLocations?.map((user: any) => ({
            country: user.addressInfo?.country,
            city: user.addressInfo?.city,
            zipCode: user.addressInfo?.zipCode,
          }))
        )
      );

      setLocationResults(uniqueLocations);
      setShowLocationResults(true);
    } else {
      setLocationResults([]);
      setShowLocationResults(false);
      handleLocationReset();
    }
  };

  // Handle location selection
  const handleLocationSelect = (selectedLocation: any) => {
    setSkipQuery(false);
    setAllServicesSelected(false);

    // Set the search term to show the selected location
    setLocationSearchTerm(
      selectedLocation.city ||
        selectedLocation.zipCode ||
        selectedLocation.country ||
        ""
    );

    // Update URL and trigger API request with proper query parameters
    debouncedFilter({
      searchTerm: selectedItem || selectedCategory || undefined,
      ...(selectedLocation.country && {
        "addressInfo.country": selectedLocation.country,
      }),
      ...(selectedLocation.city && {
        "addressInfo.city": selectedLocation.city,
      }),
      ...(selectedLocation.zipCode && {
        "addressInfo.zipCode": selectedLocation.zipCode,
      }),
      rating: selectedRating,
    });

    setShowLocationResults(false);
  };

  // Reset location filter
  const handleLocationReset = () => {
    safeStateUpdate(() => {
      setLocation("");
      // Reset skipQuery flag when resetting location
      setSkipQuery(false);

      // Update "All Services" selection state
      setAllServicesSelected(
        !searchTerm && !selectedItem && !selectedCategory && !selectedRating
      );

      debouncedFilter({
        searchTerm: selectedItem || selectedCategory || undefined,
        location: "",
        rating: selectedRating,
      });
    });
  };

  // Reset rating filter
  const handleRatingReset = () => {
    safeStateUpdate(() => {
      setSelectedRating(null);
      // Reset skipQuery flag when resetting rating
      setSkipQuery(false);

      // Update "All Services" selection state
      setAllServicesSelected(
        !searchTerm && !selectedItem && !selectedCategory && !location
      );

      debouncedFilter({
        searchTerm: selectedItem || selectedCategory || undefined,
        location,
        rating: null,
      });
    });
  };

  // Handle keyboard navigation for search suggestions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        } else if (searchTerm.trim()) {
          // If no suggestion is selected but there's search text, use the search term
          debouncedFilter({
            searchTerm: searchTerm.trim(),
            location,
            rating: selectedRating,
          });
        }
        setShowSuggestions(false);
        break;
      case "Escape":
        e.preventDefault();
        setShowSuggestions(false);
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleResetAllFilters = () => {
    safeStateUpdate(() => {
      // Reset all state variables
      onCategorySelect(null);
      onItemSelect(null);
      setOpenCategories([]);
      setSearchTerm("");
      setLocation("");
      setSelectedRating(null);
      setSelectedIndex(-1);
      setShowSuggestions(false);

      // Set All Services as selected and reset query state
      setAllServicesSelected(true);
      setSkipQuery(true);

      // Reset URL and force a clean state
      router.replace("/service-result", { scroll: false });

      // Force immediate service filter update with all users
      if (allUsers?.data) {
        onServiceFilter(allUsers.data);
      }
    });

    // Force URL params cleanup after state update
    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.toString()) {
      window.history.replaceState({}, "", "/service-result");
    }
  };

  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [showLocationResults, setShowLocationResults] = useState(false);

  return (
    <div className="p-4 bg-gray-50 border border-[#D2B9A1] rounded-lg w-full sm:w-[300px]">
      {/* Add CSS transition for smooth state changes */}
      <style jsx>{`
        .fade-transition {
          transition: opacity 0.3s ease-in-out, filter 0.3s ease-in-out;
          opacity: 1;
        }
        .fade-transition.loading {
          opacity: 0.7;
          filter: grayscale(20%);
          pointer-events: none;
        }
        .item-transition {
          transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
        }
        .suggestion-item {
          padding: 10px;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        .suggestion-item:hover,
        .suggestion-item.selected {
          background-color: #edf2f7;
        }
        .suggestion-item.selected {
          background-color: #e2e8f0;
        }
      `}</style>

      {/* Search Box with Live Suggestions */}
      <div className="relative" ref={searchInputRef}>
        <input
          type="search"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
          placeholder="Search services/locations/postal/zip"
          className="w-full p-2 border border-[#D2B9A1] rounded-full mb-4 text-sm"
          disabled={isTransitioning}
        />

        {/* Live Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`suggestion-item text-sm ${
                  index === selectedIndex ? "selected" : ""
                }`}
                onClick={() => handleSuggestionSelect(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}

        {/* Loading State */}
        {isFilteredDataLoading && searchTerm && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
            Searching...
          </div>
        )}
      </div>

      {/* Categories Section with transition effect */}
      <div
        className={`mb-6 fade-transition ${
          isTransitioning || isFilteredDataLoading || isAllUsersLoading
            ? "loading"
            : ""
        }`}
      >
        <h2 className="text-lg font-semibold mb-4 text-[#070707]">
          Categories
        </h2>
        <div className="max-h-[500px] overflow-y-auto pr-2 space-y-2">
          {/* All Services Option */}
          <div
            className={`p-2 cursor-pointer rounded text-sm item-transition ${
              allServicesSelected
                ? "bg-teal-500 text-white"
                : "hover:bg-gray-200"
            }`}
            onClick={handleResetAllFilters}
          >
            All Services
          </div>

          {/* Dynamic Categories and SubCategories */}
          {categories.map((category) => (
            <div key={category._id} className="mb-2">
              <div
                className={`p-2 cursor-pointer rounded flex justify-between items-center text-sm item-transition ${
                  selectedCategory === category.category_name && !selectedItem
                    ? "bg-teal-500 text-white"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => toggleCategory(category.category_name)}
              >
                <span>{category.category_name}</span>
                {category.subCategories?.length > 0 ? (
                  isOpen(category.category_name) ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )
                ) : null}
              </div>

              {isOpen(category.category_name) && (
                <div className="ml-4 mt-2 space-y-1">
                  {category.subCategories?.length > 0 ? (
                    category.subCategories.map((sub: any) => (
                      <div
                        key={sub._id}
                        className={`block p-2 text-sm rounded cursor-pointer item-transition ${
                          selectedItem === sub.subCategory
                            ? "bg-teal-500 text-white"
                            : "text-gray-600 hover:text-teal-600 hover:bg-gray-100"
                        }`}
                        onClick={() =>
                          handleItemClick(
                            category.category_name,
                            sub.subCategory
                          )
                        }
                      >
                        {sub.subCategory}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 p-2">
                      No subcategories available
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Location Filter with transition effect */}
      <div
        className={`mb-6 fade-transition ${
          isTransitioning || isFilteredDataLoading || isAllUsersLoading
            ? "loading"
            : ""
        }`}
      >
       
      </div>

      {/* Ratings Filter with transition effect */}
      <div
        className={`fade-transition ${
          isTransitioning || isFilteredDataLoading || isAllUsersLoading
            ? "loading"
            : ""
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#070707]">Ratings</h2>
          <button
            onClick={handleRatingReset}
            className="text-xs text-teal-600 hover:text-teal-700 cursor-pointer"
            disabled={isTransitioning}
          >
            Reset
          </button>
        </div>

        {(isFilteredDataLoading || isAllUsersLoading) && (
          <div className="text-sm text-gray-500 text-center mb-2">
            Loading results...
          </div>
        )}

        <div className="space-y-2">
          {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1].map((rating) => (
            <div
              key={rating}
              onClick={() => handleRatingSelect(rating)}
              className={`flex items-center gap-2 p-2 rounded cursor-pointer item-transition ${
                selectedRating === rating && !allServicesSelected
                  ? "bg-teal-500 text-white"
                  : "hover:bg-gray-200"
              } ${isTransitioning ? "pointer-events-none" : ""}`}
            >
              <input
                type="checkbox"
                checked={selectedRating === rating && !allServicesSelected}
                readOnly
                className="rounded border-gray-300"
                disabled={isTransitioning}
              />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`h-4 w-4 ${
                      index < rating
                        ? selectedRating === rating && !allServicesSelected
                          ? "fill-white text-white"
                          : "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2">({rating})</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showLocationResults && locationResults.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {locationResults.map((location, index) => (
            <div
              key={index}
              className="p-2 cursor-pointer text-sm hover:bg-gray-100"
              onClick={() => handleLocationSelect(location)}
            >
              <div className="flex flex-col">
                {location.city && (
                  <span className="font-medium">{location.city}</span>
                )}
                <div className="flex justify-between text-gray-600">
                  {location.country && <span>{location.country}</span>}
                  {location.zipCode && <span>ZIP: {location.zipCode}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
