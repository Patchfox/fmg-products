export function parseProduct($, baseURL) {
  const details = {};
  details.baseURL = baseURL;
  details.h1 = $(".equipment-detail-header h1").text().trim();
  details.h2 = $(".equipment-detail h2").text().trim();
  details.h3 = $(".equipment-detail h3").text().trim();
  if ($(".equipment-detail .equipment-detail-image img").length > 0) {
    details.imgUrl = baseURL + $(".equipment-detail .equipment-detail-image img").attr("src");
  } else {
    details.imgUrl = baseURL + $(".owl-carousel img").attr("src");
  }
  details.imgTitle = $(".equipment-detail .equipment-detail-image img").attr("title");
  details.fullPrice = $(".equipment-detail-summe").first().text();
  details.engines = [];
  if ($(".item-content .equipment-detail-price[data-nr^='EN']").length > 0) {
    $(".item-content .equipment-detail-price[data-nr^='EN']").each((_, elem) => {
      const engineName = $(elem).next("strong").text();
      const enginePrice = $(elem).attr("value");
      const engineOrderNumber = $(elem).attr("data-nr");
      const engineDetails = $(elem)
        .parent("label")
        .siblings("div")
        .find(".element-description .well")
        .remove("br")
        .text();
      details.engines.push({ engineName, enginePrice, engineOrderNumber, engineDetails });
    });
  } else if (".equipment-detail-price[data-nr^='EN']") {
    $(".equipment-detail-price[data-nr^='EN']").each((_, elem) => {
      const engineName = $(elem).prevAll("strong").text();
      const enginePrice = $(elem).attr("value");
      const engineOrderNumber = $(elem).attr("data-nr");
      const engineDetails = $(elem).nextAll(".element-description").find(".well").remove("br").text();
      details.engines.push({ engineName, enginePrice, engineOrderNumber, engineDetails });
    });
  } else {
    const engineName = "";
    const enginePrice = "";
    const engineOrderNumber = "";
    const engineDetails = "";
    details.engines.push({ engineName, enginePrice, engineOrderNumber, engineDetails });
  }

  details.instructions = [];
  $(".equipment-detail div.container div.row div.col-md-6:nth-child(1) a").each((_, elem) =>
    details.instructions.push(baseURL + $(elem).attr("href"))
  );

  if ($(".other-equipment-cb.equipment-detail-price[data-nr^='AC']").length > 0) {
    details.expandableName = $(".other-equipment-cb.equipment-detail-price[data-nr^='AC']")
      .next("strong")
      .text()
      .replace("Anbaugerät:", "")
      .trim();
    details.expandableOrder = $(".other-equipment-cb.equipment-detail-price[data-nr^='AC']").attr("data-nr");
    details.expandablePrice = $(".other-equipment-cb.equipment-detail-price[data-nr^='AC']").attr("value");
  } else if ($(".equipment-detail-price[data-nr^='MEQ']").length > 0) {
    details.expandableName = $(".equipment-detail-price[data-nr^='MEQ']")
      .prevAll("strong")
      .first()
      .text()
      .replace("Anbaugerät:", "")
      .trim();
    details.expandableOrder = $(".equipment-detail-price[data-nr^='MEQ']").attr("data-nr");
    details.expandablePrice = $(".equipment-detail-price[data-nr^='MEQ']").attr("value");
  } else {
    details.expandableName = "";
    details.expandableOrder = "";
    details.expandablePrice = "";
  }
  // console.log(details);
  return details;
}
