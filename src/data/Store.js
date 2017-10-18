import Freezer from "freezer-js";
import axios from "axios";

/**
 * Redux-replacing, Immutable-like, simpler event-emmiting store
 */

const store = new Freezer({
  loaded: false,
  api: {
    url:
      "https://weedmaps.com/api/web/v1/listings/native-roots-apothecary/menu?type=dispensary",
    loading: false,
    listing: [],
    categories: []
  },
  items: {
    all: [],
    current: []
  }
});
const EVENTS = {
  FILTER_CATEGORY: "filterCategory",
  LOAD_DATA: "loadData",
  SORT_ALPHA: "sortAlpha",
  SORT_PRICE_ASC: "sortPriceAsc",
  SORT_PRICE_DESC: "sortPriceDesc",
  SEARCH: "search",
  CLEAR_SEARCH: "clearSearch"
};

function getPriceForPrices(prices) {
  let unit = "";
  let price = Number.MAX_SAFE_INTEGER;
  for (let unitType in prices) {
    if (prices[unitType] > 0 && prices[unitType] < price) {
      // New lowest price
      unit = unitType;
      price = prices[unitType];
    }
  }
  return { unit: unit, price: price };
}

// TODO: Factor this into somewhere neater
store.on(EVENTS.LOAD_DATA, async () => {
  let snapshot = store.get();
  try {
    let weedData = await axios.get(snapshot.api.url);

    if (weedData.data && weedData.data.categories && weedData.data.listing) {
      let transformedCategories = weedData.data.categories.reduce(
        (prev, category) => {
          return prev.concat(
            ...category.items.map(o => {
              return {
                category: category.title,
                name: o.name,
                body: o.body,
                price: getPriceForPrices(o.prices),
                thumb_image_url: o.thumb_image_url,
                id: o.id
              };
            })
          );
        },
        []
      );

      console.log(">>>transformedCategories", transformedCategories);
      console.log(
        ">>>transformedCategories Alpha",
        transformedCategories.sort((a, b) => a.price.price < b.price.price)
      );
      store.set({
        loaded: true,
        api: {
          categories: weedData.data.categories,
          listing: weedData.data.listing
        },
        items: {
          all: transformedCategories.reverse(),
          current: transformedCategories.reverse()
        }
      });
    } else {
      console.log(">>> NO DATA RETURNED", weedData);
    }
  } catch (error) {
    // TODO: Proper error handling with display
    console.log(`>>> Error fetching data from ${snapshot.api.url}`, error);
    alert("Unable to get data");
  }
});

store.on(EVENTS.FILTER_CATEGORY, categoryName => {
  let allItems = store.get().items;
  allItems.current.set(
    allItems.all.filter(item => item.category == categoryName)
  );
});

store.on(EVENTS.SORT_ALPHA, () => {
  let allItems = store.get().items;
  allItems.current.set(
    ...allItems.current.sort(
      (a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)
    )
  );
});
store.on(EVENTS.SORT_PRICE_ASC, () => {
  let allItems = store.get().items;
  allItems.current.set(
    ...allItems.current.sort((a, b) => a.price.price - b.price.price)
  );
});
store.on(EVENTS.SORT_PRICE_DESC, () => {
  let allItems = store.get().items;
  allItems.current.set(
    ...allItems.current.sort((a, b) => b.price.price - a.price.price)
  );
});

export { store, EVENTS };
