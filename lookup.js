import fetch from "node-fetch"
import { Tabletojson as tableToJson } from "tabletojson"

const responseLimit = 25

export const lookup = async (term) => {
  let results = await fetch(
    `https://briefpedia.com/AjaxTables.php?search=${encodeURIComponent(term)}`,
    {
      referrer: "https://briefpedia.com/",
      body: null,
      method: "GET",
    }
  );
  results = await results.text();
  const tables = tableToJson.convert(results)
  if (!tables.length) return '*No results found on <https://briefpedia.com>*'
  const [briefs, conflicts] = tables.map(table => table.slice(1))


  const briefCount = briefs.length
  const briefBulletedList = briefs.slice(0, responseLimit).map(entry => `- \`${entry['1'].replace(/ /g, '')}\``).join('\n')
  const resultsText = briefCount > responseLimit ? `Showing ${responseLimit} of ${briefCount} results` : `Showing ${briefCount} results`
  return `**${resultsText} for "${term}" from <https://briefpedia.com>:**\n\n${briefBulletedList}`
};
