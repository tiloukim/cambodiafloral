const KEY = "240a0d10e205ebbbc684d6eaba035152";
const HOST = "cambodiafloral.com";

const urls = [
  `https://${HOST}/`,
  `https://${HOST}/shop`,
  `https://${HOST}/send-flowers-to-cambodia`,
  `https://${HOST}/phnom-penh-flower-delivery`,
  `https://${HOST}/about`,
  `https://${HOST}/contact`,
  `https://${HOST}/custom-order`,
  `https://${HOST}/privacy`,
  `https://${HOST}/track`,
];

const body = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList: urls,
});

async function submit(engine, endpoint) {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    console.log(`${engine}: ${res.status} ${res.statusText}`);
  } catch (err) {
    console.error(`${engine}: ${err.message}`);
  }
}

console.log(`Submitting ${urls.length} URLs to IndexNow...\n`);

await Promise.all([
  submit("Bing", "https://www.bing.com/indexnow"),
  submit("IndexNow.org", "https://api.indexnow.org/indexnow"),
]);

console.log("\nDone!");
