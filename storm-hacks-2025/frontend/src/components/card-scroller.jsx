import { ScrollArea } from "@/components/ui/scroll-area"
import * as React from "react"

import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useState, useEffect } from 'react'
import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"

const data = [
  {
    "Name": "Charizard - 010/078 - Rare Holo [pgo-010] [Holo]",
    "Price_Min": "1.99",
    "Price_Max": "2.49",
    "Available": true,
    "Retailer": "FaceToFaceGames",
    "Vendor": "Pokémon",
    "Type": "Singles",
    "URL": "https://facetofacegames.com/products/charizard-010078-rare-holo-pgo-010-holo?_pos=1&_psq=charizard&_ss=e&_v=1.0",
    "Image": "https://cdn.shopify.com/s/files/1/0574/4692/4324/files/c89f3a333f69c5d7f2374b4618e86d5d2f027604_Asset_PKM_PGO_010_ENG_H_jpg.jpg?v=1737591869",
    "Timestamp": "2025-10-05T04:47:47.678687"
  },
  {
    "Name": "Charizard V - 019/189 - Rare Ultra [swsh3-019] [Ultra]",
    "Price_Min": "5.59",
    "Price_Max": "7.99",
    "Available": true,
    "Retailer": "FaceToFaceGames",
    "Vendor": "Pokémon",
    "Type": "Singles",
    "URL": "https://facetofacegames.com/products/charizard-v-019189-rare-ultra-swsh3-019-ultra?_pos=2&_psq=charizard&_ss=e&_v=1.0",
    "Image": "https://cdn.shopify.com/s/files/1/0574/4692/4324/files/f33e39c7eb904d0f7d6650ca96d3501539671d64_Asset_PKM_SWSH3_019_ENG_U_jpg.jpg?v=1737598395",
    "Timestamp": "2025-10-05T04:47:47.678721"
  },
  {
    "Name": "Charizard-EX - XY17 - Promo [xyp-XY17] [Ultra]",
    "Price_Min": "31.49",
    "Price_Max": "44.99",
    "Available": true,
    "Retailer": "FaceToFaceGames",
    "Vendor": "Pokémon",
    "Type": "Singles",
    "URL": "https://facetofacegames.com/products/charizard-ex-xy17-promo-xyp-xy17-ultra?_pos=3&_psq=charizard&_ss=e&_v=1.0",
    "Image": "https://cdn.shopify.com/s/files/1/0574/4692/4324/files/abc763832aa4524718850e47073757e5efe27833_Asset_PKM_XYP_XY17_ENG_U_jpg.jpg?v=1737601730",
    "Timestamp": "2025-10-05T04:47:47.678734"
  },
  {
    "Name": "Charizard-EX - 11/83 - Rare Holo EX [g1-11] [Ultra]",
    "Price_Min": "19.59",
    "Price_Max": "27.99",
    "Available": true,
    "Retailer": "FaceToFaceGames",
    "Vendor": "Pokémon",
    "Type": "Singles",
    "URL": "https://facetofacegames.com/products/charizard-ex-1183-rare-holo-ex-g1-11-ultra?_pos=4&_psq=charizard&_ss=e&_v=1.0",
    "Image": "https://cdn.shopify.com/s/files/1/0574/4692/4324/files/493b9258856615d83b484f4e3cbac5c3e5f88964_Asset_PKM_G1_11_ENG_U_jpg.jpg?v=1737590661",
    "Timestamp": "2025-10-05T04:47:47.678743"
  },
  {
    "Name": "Charizard V - 018/159 - Rare Holo V [swsh125-018] [Ultra]",
    "Price_Min": "3.49",
    "Price_Max": "4.99",
    "Available": true,
    "Retailer": "FaceToFaceGames",
    "Vendor": "Pokémon",
    "Type": "Singles",
    "URL": "https://facetofacegames.com/products/charizard-v-018159-rare-holo-v-swsh125-018-ultra?_pos=5&_psq=charizard&_ss=e&_v=1.0",
    "Image": "https://cdn.shopify.com/s/files/1/0574/4692/4324/files/7a7565f6f39c02e6e74df5ff394cb364ceb2e3d7_Asset_PKM_SWSH125_018_ENG_U_jpg.jpg?v=1737597514",
    "Timestamp": "2025-10-05T04:47:47.678750"
  },
  {
    "Name": "Pokemon - Charizard ex Special Collection",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/pokemon-charizard-ex-special-collection?_pos=1&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.202643"
  },
  {
    "Name": "Pokemon - Sword & Shield - Ultra Premium Collection - Charizard",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/pokemon-sword-shield-ultra-premium-collection-charizard?_pos=2&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.203218"
  },
  {
    "Name": "Charizard Spirit Link - 75/108 - Uncommon",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-spirit-link-75-108-uncommon?_pos=3&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.203764"
  },
  {
    "Name": "Pokemon - Celebrations - Collection Box - Lance's Charizard V",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/pokemon-celebrations-collection-box-lances-charizard-v?_pos=4&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.204296"
  },
  {
    "Name": "Ultra Pro - Zip Binder 12 Pocket - Pokemon - Charizard",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/ultra-pro-zip-binder-12-pocket-pokemon-charizard?_pos=5&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.204817"
  },
  {
    "Name": "Charizard GX - SM211 - Promo",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-gx-sm211-promo?_pos=6&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.205307"
  },
  {
    "Name": "Charizard - 001/015 - Promo",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-001-015-promo?_pos=7&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.205785"
  },
  {
    "Name": "Charizard - 11/108 - Holo Rare",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-11-108-holo-rare?_pos=8&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.206252"
  },
  {
    "Name": "Charizard V - SWSH260 - Alternate Art Promo",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-v-swsh260-alternate-art-promo?_pos=9&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.206717"
  },
  {
    "Name": "Charizard & Braixen GX - 22/236 - Ultra Rare",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-braixen-gx-22-236-ultra-rare?_pos=10&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.207178"
  },
  {
    "Name": "Charizard - 4/102 - Holo Rare (Classic Collection)",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-4-102-holo-rare-classic-collection?_pos=11&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.207623"
  },
  {
    "Name": "Charizard ex - 228/197 - Gold Secret Rare",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-ex-228-197-gold-secret-rare?_pos=12&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.208055"
  },
  {
    "Name": "Lance's Charizard V - SWSH133 - Promo",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/lances-charizard-v-swsh133-promo?_pos=13&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.208471"
  },
  {
    "Name": "Reshiram & Charizard GX - SM247 - Promo",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/reshiram-charizard-gx-sm247-promo?_pos=14&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.208878"
  },
  {
    "Name": "Charizard GX - 20/147 - Ultra Rare",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-gx-20-147-ultra-rare?_pos=15&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.209306"
  },
  {
    "Name": "Ultra Pro - Alcove Deck Box - Pokemon - Charizard",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/ultra-pro-alcove-deck-box-pokemon-charizard?_pos=16&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.209719"
  },
  {
    "Name": "Pokemon - Kanto Power Mini Tin - Charizard",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/pokemon-kanto-power-mini-tin-charizard?_pos=17&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.210110"
  },
  {
    "Name": "Charizard EX - XY17 - Ultra Rare Promo",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-ex-xy17-ultra-rare-promo?_pos=18&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.210487"
  },
  {
    "Name": "Charizard - 1/99 - Holo Rare",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-1-99-holo-rare?_pos=19&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.210850"
  },
  {
    "Name": "Charizard - 103/100 - Ultra Rare",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-103-100-ultra-rare?_pos=20&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.211195"
  },
  {
    "Name": "Charizard - SM226 - Holo Promo",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-sm226-holo-promo?_pos=21&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.211526"
  },
  {
    "Name": "Charizard - RC5/RC32 - Uncommon",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-rc5-rc32-uncommon?_pos=22&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.211847"
  },
  {
    "Name": "Charizard GX - SM60 - Full Art Promo",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-gx-sm60-full-art-promo?_pos=23&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.212166"
  },
  {
    "Name": "Charizard - TG03/TG30 - Holo Rare",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-tg03-tg30-holo-rare?_pos=24&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.212472"
  },
  {
    "Name": "Charizard - 19/113 - Holo Rare",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-19-113-holo-rare?_pos=25&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.212770"
  },
  {
    "Name": "Charizard EX - XY121 - Ultra Rare Promo",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-ex-xy121-ultra-rare-promo?_pos=26&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.213062"
  },
  {
    "Name": "Charizard - 6/108 - Holo Rare",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-6-108-holo-rare?_pos=27&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.213341"
  },
  {
    "Name": "Charizard G LV.X - 143/147 - Ultra Rare",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-g-lv-x-143-147-ultra-rare?_pos=28&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.213605"
  },
  {
    "Name": "Charizard G - 20/147 - Rare",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-g-20-147-rare?_pos=29&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.213861"
  },
  {
    "Name": "Charizard - 20/149 - Holo Rare",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-20-149-holo-rare?_pos=30&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.214111"
  },
  {
    "Name": "Dark Charizard - 21/82 - Rare - Unlimited",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/dark-charizard-21-82-rare-unlimited?_pos=31&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.214362"
  },
  {
    "Name": "Charizard - 3/132 - Holo Rare",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-3-132-holo-rare?_pos=32&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.214618"
  },
  {
    "Name": "M Charizard EX - 69/106 - Ultra Rare",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/m-charizard-ex-69-106-ultra-rare?_pos=33&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.214888"
  },
  {
    "Name": "Charizard VSTAR - SWSH262 - Alternate Art Promo",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-vstar-swsh262-alternate-art-promo?_pos=34&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.215116"
  },
  {
    "Name": "Charizard - 1/99 - Shattered Holo Promo",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-1-99-shattered-holo-promo?_pos=35&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.215320"
  },
  {
    "Name": "Charizard VMAX - 074/073 - Hyper Rare",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-vmax-074-073-hyper-rare?_pos=36&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.215513"
  },
  {
    "Name": "Charizard VMAX - SV107/SV122 - Shiny Rare",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-vmax-sv107-sv122-shiny-rare?_pos=37&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.215698"
  },
  {
    "Name": "Charizard - 20/149 - Alternate Holo - Promo",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-20-149-alternate-holo-promo?_pos=38&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.215872"
  },
  {
    "Name": "M Charizard EX - 12/83 - Ultra Rare",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/m-charizard-ex-12-83-ultra-rare?_pos=39&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.216035"
  },
  {
    "Name": "Cynthia (#21 Charizard Stamped) - 119/156 - Promo",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/cynthia-21-charizard-stamped-119-156-promo?_pos=40&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.216189"
  },
  {
    "Name": "Charizard - 11/108 - Pre-Release Promo",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-11-108-pre-release-promo?_pos=41&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.216334"
  },
  {
    "Name": "Charizard V - 079/073 - Shiny Secret Rare",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-v-079-073-shiny-secret-rare?_pos=42&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.216470"
  },
  {
    "Name": "Salazzle (#7 Charizard Stamped) - 034/236 - Promo",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/salazzle-7-charizard-stamped-034-236-promo?_pos=43&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.216607"
  },
  {
    "Name": "M Charizard EX - 13/106 - Ultra Rare",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/m-charizard-ex-13-106-ultra-rare?_pos=44&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.216725"
  },
  {
    "Name": "Eevee (#26 Charizard Stamped) - 049/068 - Promo",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/eevee-26-charizard-stamped-049-068-promo?_pos=45&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.216833"
  },
  {
    "Name": "Charizard - 1/99 - Holo Rare - Reverse Holo",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-1-99-holo-rare-reverse-holo?_pos=46&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.216928"
  },
  {
    "Name": "Hau (#52 Charizard Stamped) - 120/149 - Promo",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/hau-52-charizard-stamped-120-149-promo?_pos=47&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.217018"
  },
  {
    "Name": "Reshiram & Charizard GX - SM201 - Alternate Art Promo",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/reshiram-charizard-gx-sm201-alternate-art-promo?_pos=48&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.217094"
  },
  {
    "Name": "Salazzle (#49 Charizard Stamped) - 034/236 - Promo",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/salazzle-49-charizard-stamped-034-236-promo?_pos=49&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.217163"
  },
  {
    "Name": "Charizard G - 20/147 - Rare - Reverse Holo",
    "Price": "N/A",
    "Retailer": "401Games",
    "URL": "https://store.401games.ca/products/charizard-g-20-147-rare-reverse-holo?_pos=50&_sid=40a4375e6&_ss=r",
    "Timestamp": "2025-10-05T04:47:48.217224"
  },
  {
    "Name": "Charizard Ex Special Collection",
    "Retailer": "KanataCG",
    "URL": "https://kanatacg.crystalcommerce.com/products/search?query=charizard",
    "Timestamp": "2025-10-05T04:47:54.945817"
  },
  {
    "Name": "Collector Chest Tin 2023 (Charizard)",
    "Retailer": "KanataCG",
    "URL": "https://kanatacg.crystalcommerce.com/products/search?query=charizard",
    "Timestamp": "2025-10-05T04:47:54.945853"
  },
  {
    "Name": "Pokemon Charizard Ex Special Collection",
    "Retailer": "KanataCG",
    "URL": "https://kanatacg.crystalcommerce.com/products/search?query=charizard",
    "Timestamp": "2025-10-05T04:47:54.945863"
  },
  {
    "Name": "Deck Box - Alcove Flip - Pokemon Charizard 100+",
    "Retailer": "KanataCG",
    "URL": "https://kanatacg.crystalcommerce.com/products/search?query=charizard",
    "Timestamp": "2025-10-05T04:47:54.945870"
  },
  {
    "Name": "Ultra Pro Alcove Flip Pokemon Elite Series Charizard",
    "Retailer": "KanataCG",
    "URL": "https://kanatacg.crystalcommerce.com/products/search?query=charizard",
    "Timestamp": "2025-10-05T04:47:54.945878"
  }
]




export default function CardScrollArea() {

  const [selectedItems, setSelectedItems] = useState(new Set());

  const toggleItem = (itemKey) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemKey)) {
        newSet.delete(itemKey);
      } else {
        newSet.add(itemKey);
      }
      return newSet;
    });
  };

  const selectedCount = selectedItems.size;

  // Get selected items data - defined INSIDE the component
  const getSelectedItems = () => {
    return data.filter(item => {
      const itemKey = `${item.Name}-${item.URL}`;
      return selectedItems.has(itemKey);
    });
  };

  

  // Use selected items (for logging or processing)
  const selectedItemsList = getSelectedItems();
  console.log('Selected items:', selectedItemsList);


  const calculateTotalMinPrice = () => {
  let totalMinPrice = 0;
  
  selectedItems.forEach((itemKey) => {
    // Find the item in your data
    const selectedItem = data.find(item => `${item.Name}-${item.URL}` === itemKey);
    
    if (selectedItem && selectedItem.Price_Min) {
      // Add the PriceMin value to the total
      totalMinPrice += parseFloat(selectedItem.Price_Min) || 0;
    }
  });
  
  return totalMinPrice;
  };

  const calculateTotalMaxPrice = () => {
  let totalMaxPrice = 0;
  
  selectedItems.forEach((itemKey) => {
    // Find the item in your data
    const selectedItem = data.find(item => `${item.Name}-${item.URL}` === itemKey);
    
    if (selectedItem && selectedItem.Price_Max) {
      // Add the PriceMin value to the total
      totalMaxPrice += parseFloat(selectedItem.Price_Max) || 0;
    }
  });
  
  return totalMaxPrice;
  };



  const copy_to_clipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard');
    }).catch(err => {
      console.error('Error in copying text: ', err);
    });
  }



  const totalMin = calculateTotalMinPrice();
  const totalMax = calculateTotalMaxPrice();

  return (
    <div>
    <ScrollArea className="h-[calc(100vh-120px)] rounded-md border">
      <div className="p-1">
        {data.map((item) => (
          <Card key={`${item.Name}-${item.URL}`} className="transition-shadow mb-1 last:mb-0">
            <div className="p-2 flex items-start gap-3">

              <Toggle
                // pressed={isSelected}
                onPressedChange={() => toggleItem(`${item.Name}-${item.URL}`)} className="flex-shrink-0 mt-1">
                <svg className="fill-black dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 4V22C3 23.1 3.9 24 5 24H17V22H5V4H3M19 0H9C7.9 0 7 .9 7 2V18C7 19.1 7.9 20 9 20H19C20.1 20 21 19.1 21 18V2C21 .9 20.1 0 19 0M16 13C15.4 13 14.9 12.7 14.5 12.3L15.5 15H12.5L13.5 12.3C13.1 12.7 12.6 13 12 13C10.9 13 10 12.1 10 11S10.9 9 12 9H12.3C12.1 8.7 12 8.4 12 8C12 6.9 12.9 6 14 6S16 6.9 16 8C16 8.4 15.9 8.7 15.7 9H16C17.1 9 18 9.9 18 11S17.1 13 16 13Z" /></svg>
              </Toggle>


              <div className="flex-1 min-w-0">
                <CardTitle className="text-sm truncate">
                  <a href={item.URL || "#"} className="hover:underline">
                    {item.Name || "No name provided."}
                  </a>
                </CardTitle>
                <CardDescription className="text-xs truncate">
                  {[item.Retailer, item.Vendor].filter(Boolean).join(' • ')}
                </CardDescription>
              </div>


              <p className="text-xs text-gray-400 flex-shrink-0">
                {[item.Price_Min, item.Price_Max].filter(Boolean).join(' - ') || ""}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
    

    <footer className="border-t bg-background p-2 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Found {data.length} cards • Selected: {selectedCount} • {totalMin.toFixed(2)}  Minimum Price • {totalMax.toFixed(2)}  Maximum Price
          </div>
          <div className="flex gap-4">
            <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-700/10" onClick={() => copy_to_clipboard(JSON.stringify(getSelectedItems(), null, 2))} disabled={selectedCount === 0} title="Copy Selected Items to Clipboard">
              <svg className="fill-black dark:fill-white" width="800px" height="800px" viewBox="0 0 36 36" version="1.1"  preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <path d="M22.6,4H21.55a3.89,3.89,0,0,0-7.31,0H13.4A2.41,2.41,0,0,0,11,6.4V10H25V6.4A2.41,2.41,0,0,0,22.6,4ZM23,8H13V6.25A.25.25,0,0,1,13.25,6h2.69l.12-1.11A1.24,1.24,0,0,1,16.61,4a2,2,0,0,1,3.15,1.18l.09.84h2.9a.25.25,0,0,1,.25.25Z" class="clr-i-outline clr-i-outline-path-1"></path><path d="M33.25,18.06H21.33l2.84-2.83a1,1,0,1,0-1.42-1.42L17.5,19.06l5.25,5.25a1,1,0,0,0,.71.29,1,1,0,0,0,.71-1.7l-2.84-2.84H33.25a1,1,0,0,0,0-2Z" class="clr-i-outline clr-i-outline-path-2"></path><path d="M29,16h2V6.68A1.66,1.66,0,0,0,29.35,5H27.08V7H29Z" class="clr-i-outline clr-i-outline-path-3"></path><path d="M29,31H7V7H9V5H6.64A1.66,1.66,0,0,0,5,6.67V31.32A1.66,1.66,0,0,0,6.65,33H29.36A1.66,1.66,0,0,0,31,31.33V22.06H29Z" class="clr-i-outline clr-i-outline-path-4"></path>
                  <rect x="0" y="0" width="36" height="36" fill-opacity="0"/>
              </svg>
            </Button>
            
          </div>
        </div>
    </footer>

    </div>
    
  )
}