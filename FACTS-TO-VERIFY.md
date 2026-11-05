# Facts to verify before launch

Every factual claim on the site that can change, or that we could not confirm from an official source while building, is listed here. Check each against the source given, update the copy in `src/content/<lang>/*.json` (all four languages), and note the date you checked it.

Status key: **[ ]** not yet checked · **[x]** checked (add date and initials)

## Entry rules and travel advice

| # | Claim on the site | Where it appears | Official source |
|---|---|---|---|
| [ ] 1 | Many nationalities can enter Thailand visa-free "for a limited stay, and the length has changed recently". The brand brief records a cut from 60 to **30 days** for UK passports from **15 September 2026**; check this and the length for US, EU and Australian passports. The site deliberately gives no number. | Home FAQ "Do I need a visa?"; Booking Terms §10 | https://www.gov.uk/foreign-travel-advice/thailand/entry-requirements · https://www.mfa.go.th/en/ · https://www.thaievisa.go.th |
| [ ] 2 | The **Thailand Digital Arrival Card (TDAC)** must be completed online before arrival (mandatory since 1 May 2025, within 3 days of arrival). | Home FAQ | https://tdac.immigration.go.th |
| [ ] 3 | Any **tourist entry fee** (discussed, not confirmed). The site says "visa or entry fees, if any apply". | Journeys "What we leave to you" | https://www.tourismthailand.org · https://www.mots.go.th |
| [ ] 4 | **Deep South**: FCDO advises against all but essential travel to Pattani, Yala, Narathiwat and parts of Songkhla. The site sells nothing there; confirm the current list. | Not mentioned on the site (excluded) | https://www.gov.uk/foreign-travel-advice/thailand · https://travel.state.gov |
| [ ] 5 | **Cambodian border**: government advice warns against travel **within 20 km of the Thailand–Cambodia land border** (after fighting in 2025). Koh Kood is offshore, but the mainland transfer through Trat (Laem Sok / Laem Ngop piers, Trat airport) must be measured against the current line before each booking. | Koh Kood page note; Koh Kood journey | FCDO and US State Department pages above |
| [ ] 6 | **Myanmar border** areas near Chiang Rai / Golden Triangle and Mae Hong Son: check current advice. | Chiang Rai page note; Mae Hong Son page | FCDO |
| [ ] 7 | Yellow-fever certificate if arriving from a risk country (not stated on the site; add to FAQs if needed). | — | https://travelhealthpro.org.uk/country/218/thailand |

## Seasons and monsoons

All month ratings (Good / Mixed / Wet) are long-term patterns we wrote from general climate knowledge. They live in `build.mjs` (`COAST` for the two-coasts picker and home table) and in `ratings` arrays in `src/content/*/destinations.json`. Check against Thai Meteorological Department normals (https://www.tmd.go.th/en) and record the source and date in this file.

| [ ] 8 | **Andaman coast** (Krabi, Koh Yao Noi, Koh Lanta, Phuket) best about **November–April**; southwest monsoon about **May–October**, September–October usually wettest. |
|---|---|
| [ ] 9 | **Gulf coast** (Samui, Phangan) driest about **February–August**; heaviest rain **October–December**, November usually wettest; January can still have showers. |
| [ ] 10 | **Koh Kood** (eastern Gulf, Trat) follows the southwest monsoon: wet **May–October**, best **November–April**; boats reduce schedules in the wet months. |
| [ ] 11 | **The north**: cool and dry **November–January/February**; **burning-season haze** about February–April (worst March–April); rains May–October, September wettest. |
| [ ] 12 | **Bangkok**: September–October wettest; flooding in low streets after heavy rain; Chao Phraya runs high September–November. |
| [ ] 13 | **Khao Sok**: best December–April; trails and caves can close after heavy rain. |
| [ ] 14 | Month-by-month verdicts in the two-coasts picker (`twoCoasts.months` in `features.json`), especially the "split" verdict for October. |

## National parks and closures

| [ ] 15 | **Mu Ko Lanta National Park** islands (e.g. Koh Rok) may close in the monsoon (typically mid-May to mid-October). | Koh Lanta page |
|---|---|---|
| [ ] 16 | **Ang Thong National Marine Park**: boat trips can be cancelled in the November rains; check any annual closure. | Samui page |
| [ ] 17 | **Similan and Surin Islands** close about 16 May–14 October (not sold on the site at present). | — |
| [ ] 18 | Park entry fees for foreigners (not stated on the site). | — |
| [ ] 19 | Khao Sok National Park: raft-house operations on Cheow Lan Lake, trail closures. | Khao Sok page |
| [ ] 20 | Wild elephant viewing at **Khao Yai** and **Kui Buri** national parks. | Elephants page FAQ |

Source: Department of National Parks, Wildlife and Plant Conservation — https://portal.dnp.go.th

## Places and culture

| [ ] 21 | Ayutthaya: capital for four centuries until sacked in **1767**; at the confluence of the Chao Phraya, Pa Sak and Lopburi; UNESCO World Heritage Site; about **80 km** north of Bangkok; river boats from Bangkok "on some days". |
|---|---|
| [ ] 22 | Chiang Mai founded **1296** as capital of Lanna; flight about **70 minutes**; overnight train **11–13 hours**. |
| [ ] 23 | Wat Rong Khun begun by **Chalermchai Kositpipat** in the **1990s**; Baan Dam by **Thawan Duchanee**; Sop Ruak where the Ruak meets the Mekong; flight about 80 minutes; 3 hours by road from Chiang Mai. |
| [ ] 24 | Mae Hong Son: flights from Chiang Mai "on some days" (check current schedule); Pang Ung reservoir; Su Tong Pae bamboo bridge; Tham Lod cave raft near Soppong. |
| [ ] 25 | Sukhothai: 13th-century first capital; Wat Si Chum seated Buddha; Wat Sa Si island; Si Satchanalai by the Yom; Sangkhalok ceramics; direct flights from Bangkok. |
| [ ] 26 | Cheow Lan Lake created by the **Ratchaprapha Dam in the 1980s**; road times 2.5–3 hours from Krabi, Phuket, Surat Thani. |
| [ ] 27 | Koh Yao Noi: Muslim island; speedboats from piers on the Phuket and Krabi sides; hongs only accessible at certain tides. |
| [ ] 28 | Koh Lanta: two hours from Krabi airport **including a short vehicle ferry** (a mainland bridge has been under construction — check); Lanta Old Town communities (Chinese, Muslim, Urak Lawoi). |
| [ ] 29 | Ang Thong: "more than forty islands". |
| [ ] 30 | Koh Kood: second largest island of the Trat group; Khlong Chao waterfall and canal; Ao Salad and Ao Yai villages; Trat flights. |
| [ ] 31 | **Mae Ya Nang**: garlands and coloured cloth tied to the bow for the boat's guardian spirit — confirm wording with a Thai cultural adviser. | About page; home |
| [ ] 32 | Khlong map stops and routes (Tha Tien, Wat Arun, Khlong Bangkok Yai, Khlong Bang Luang artist house, Wat Paknam Phasi Charoen, Royal Barges Museum, Khlong Bangkok Noi, Taling Chan weekend floating market); times are indicative. The map is schematic. | Khlong map page |
| [ ] 33 | Elephant sanctuaries: each supplier's welfare policy against World Animal Protection guidance before it is booked. | Elephants page |
| [ ] 34 | Hill-tribe peoples named (Karen, Hmong, Akha, Lahu, Lisu, Mien) and the Kayan village policy wording. | Elephants & hill tribes page |

## Business details

| [ ] 35 | Business address: **Gaysorn Urban Resort, 19th–20th Floor, Gaysorn Tower, 127 Ratchadamri Road, Lumphini, Pathum Wan, Bangkok 10330**. Chosen as Bangkok's flagship premium coworking space (Time Out Bangkok: "Bangkok's most luxurious and most expensive co-working space"). Confirm the floors, that the space still operates under this name, and that a membership/registered address is in place. | `src/config.js` |
|---|---|---|
| [ ] 36 | Privacy Policy and Booking Terms: have them reviewed by a lawyer for the markets you sell to (EU/UK GDPR, Thai PDPA, consumer and package-travel law). The translated versions include small local additions (CNIL in French, AEPD in Spanish, DSGVO article references in German). | `legal.json` |
| [ ] 37 | Enquiry form uses FormSubmit (formsubmit.co). The first submission sends an activation email to longtailtravel@tourground.com, which must be confirmed before enquiries are delivered. | `src/config.js` |
