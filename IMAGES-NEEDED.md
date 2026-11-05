# Images needed

The site uses only photographs whose location matches the page they appear on. Photos come from Wikimedia Commons under Creative Commons or public-domain licences and are credited on `/credits/` (generated from `images-src/manifest.json`). No photos were taken from any venue's website.

## 1. Stays (placeholder names)

The stays on the site use **placeholder names** (marked "Placeholder name" on every card). Each card shows a photo of the **destination**, not of the property. When a real hotel or lodge is contracted, replace the name and use a photo you are clearly allowed to use: the venue's media kit or press terms, a booking-platform partner feed, or a Creative Commons image. Do not copy photos from the venue's own website.

| Placeholder | Destination | Photo currently shown |
|---|---|---|
| Riverside Teak House | Bangkok | Old shophouses in the Tha Tian riverside quarter |
| The Old Customs Rooms | Bangkok | The Chao Phraya at dusk |
| The Island Guest House | Ayutthaya | Wat Phra Si Sanphet |
| Lanna Verandah House | Chiang Mai | Rice terraces at Ban Mae Klang Luang |
| The River Ping Rooms | Chiang Mai | Loy Krathong lanterns in Chiang Mai |
| The Mekong Terraces | Chiang Rai | The Golden Triangle at Sop Ruak |
| The Valley Lodge | Mae Hong Son | Morning valley, Nam Tok Mae Surin National Park |
| The Lotus Pond Rooms | Sukhothai | Wat Sa Si across the lotus pond |
| The Floating Camp | Khao Sok | Mist on Cheow Lan Lake |
| The Riverside Treehouses | Khao Sok | Raft houses at Klong Saeng, Cheow Lan Lake |
| The Bay Pool Villas | Koh Yao Noi | Phang Nga Bay from Koh Yao Noi |
| The Railay Cliff Rooms | Railay, Krabi | Longtail at Phra Nang beach |
| The Lanta Beach Houses | Koh Lanta | Klong Khong beach |
| The Gulf House | Koh Samui | Fishing boats on a Samui beach |
| The Northern Bay Bungalows | Koh Phangan | Bottle Beach |
| The Mangrove Villas | Koh Kood | Waterfall on Koh Kood |

## 2. Named places without a dedicated photo

These real places are named in the copy but have no photo of their own on the site (the page shows a correct photo of the wider destination instead). Add a licensed photo if you want to show them:

- Royal Barges Museum, Khlong Bang Luang artist house, Wat Paknam Phasi Charoen, Taling Chan floating market (khlong map)
- Wat Si Chum, Si Satchanalai (Sukhothai)
- Baan Dam, Hall of Opium, Chiang Saen (Chiang Rai)
- Su Tong Pae bamboo bridge, Pang Ung, Tham Lod cave (Mae Hong Son)
- Koh Rok, Lanta Old Town (Koh Lanta) — the second Koh Lanta slot now shows the national-park lighthouse
- Khlong Chao canal, Ao Salad and Ao Yai (Koh Kood)

## 3. Gallery gaps

Some destination galleries show two photos instead of three because no second verified photo of that exact place was found: **Ayutthaya, Chiang Rai, Sukhothai, Koh Lanta, Koh Kood**. Adding one more photo per place (to `images-src/`, `manifest.json` and the destination's `gallery` in all four languages) restores the three-photo layout.

## 4. Replacing or adding a photo

See "Images" in `README.md`: add the JPEG to `images-src/`, add its manifest entry with source, author and licence, run `npm run images`, then reference the id in the content.
