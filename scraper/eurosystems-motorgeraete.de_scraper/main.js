import Apify from "apify";
import { parseProduct } from "./parsers.js";
import { saveFile } from "./processData.js";

await Apify.utils.purgeLocalStorage();

const baseURL = "https://www.eurosystems-motorgeraete.de";
const requestQueue = await Apify.openRequestQueue();
await requestQueue.addRequest({
  url: "https://www.eurosystems-motorgeraete.de/geraete/",
  userData: { label: "LIST" },
});
// await requestQueue.addRequest({
//   url: "https://www.eurosystems-motorgeraete.de/rasen-pflegen/federrechen/geraet/m220-p55-federrechen/",
//   userData: { label: "VARIANT" },
// });
let allEngines = [];
const crawler = new Apify.CheerioCrawler({
  requestQueue,
  handlePageFunction: async ({ request, $ }) => {
    console.log(request.url, request.userData);
    if (request.userData.label === "VARIANT") {
      console.log("Parse VARIANT");
      const details = parseProduct($, baseURL);
      if (details.expandableName !== "") {
        const data = {};
        data.name = details.expandableName;
        data.imgUrl = details.imgUrl;
        data.price = details.expandablePrice;
        data.orderNumber = details.expandableOrder.split("|")[1] ?? "";
        data.detail = details.engines[0].engineDetails;
        data.instructions = details.instructions.join(" ");
        data.expandableName = "";
        data.expandableOrder = "";
        data.expandablePrice = "";
        await Apify.pushData(data);
      }

      for (let engine of details.engines) {
        const data = {};
        data.name =
          details.expandableName !== ""
            ? `${details.h1} - ${engine.engineName} - ${details.expandableName}`
            : `${details.h1} - ${engine.engineName}`;
        data.imgUrl = details.imgUrl;
        data.price = engine.enginePrice;
        data.orderNumber = engine.engineOrderNumber.split("|")[1] ?? "";
        data.detail = engine.engineDetails;
        data.instructions = details.instructions.join(" ");
        data.expandableName = details.expandableName;
        data.expandableOrder = details.expandableOrder.split("|")[1] ?? "";
        data.expandablePrice = details.expandablePrice;
        await Apify.pushData(data);

        if (details.engines.length > 1 && details.expandableName !== "") {
          const engineData = {};
          engineData.name = `${details.h1} - ${engine.engineName}`;
          engineData.imgUrl = details.imgUrl;
          engineData.price = engine.enginePrice;
          engineData.orderNumber = engine.engineOrderNumber.split("|")[1] ?? "";
          engineData.detail = engine.engineDetails;
          engineData.instructions = details.instructions.join(" ");
          engineData.expandableName = "";
          engineData.expandableOrder = "";
          engineData.expandablePrice = "";
          allEngines.push(engineData);
        }
      }
    } else if (request.userData.label === "LIST") {
      console.log("Parse LIST");
      await Apify.utils.enqueueLinks({
        $,
        requestQueue,
        selector: "a.raquo",
        baseUrl: baseURL,
        transformRequestFunction: (request) => {
          request.userData.label = "VARIANT";
          return request;
        },
      });
    }
  },
});

await crawler.run();
allEngines = allEngines.filter((v, i, a) => a.findIndex((t) => t.name === v.name) === i);
await Apify.pushData(allEngines);
await saveFile();
