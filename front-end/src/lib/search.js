import Fuse from 'fuse.js'

const search = (list, query ) => {
    const fuseOptions = {
        includeScore: false, // To include the score of how each result matches the search query
        includeMatches: true,
        keys: [
          "title",
          "subheading",
          { // Searching inside the 'details' array
            name: "details",
            weight: 0.5, // You can adjust weights to make some fields matter more than others
            getFn: (item, path) => {
              // Custom getter function to search within the array of arrays in 'details'
              return item.details.map(detail => detail[1]).join(' ');
            }
          }
        ],
        threshold: 0.3, // Determines how close the match must be. A threshold of 0 means a perfect match.
        ignoreLocation: true, // When true, search ignores location and distance of matched words.
        minMatchCharLength: 1 // Minimum number of characters that must be matched for a result to be considered a match
      };
      
    // Then you would initialize Fuse with your data and the options:
    const fuse = new Fuse(list, fuseOptions);
    const result = fuse.search(query)
    console.log(result)
    // create a new list with the results and matches
    const new_list = result.map(item => {
        const new_item = {
            ...item.item,
            matches: item.matches,
            query: query
        }
        return new_item
    })
    return new_list
} 

export default search;