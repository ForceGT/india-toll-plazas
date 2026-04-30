# Rajasthan state highways → toll plazas (heuristic)

Generated: 2026-04-30T09:01:47.544Z

**SH inventory:** [List of state highways in Rajasthan](https://en.wikipedia.org/wiki/List_of_state_highways_in_Rajasthan) (Wikipedia).

**Method:** Token overlap between Wikipedia beltway place tokens (length>=4) and NHAI/state plaza name+location in Rajasthan. Not authoritative alignment with SH geometry.

**Dataset:** `data/latest.json` — plazas with `state_name` = RAJASTHAN only (170 records).

**Counts:** 92 Wikipedia SH rows; 71 SH rows with at least one heuristic plaza match.

**Note:** The Wikipedia [article overview](https://en.wikipedia.org/wiki/List_of_state_highways_in_Rajasthan) states ~170 state highways; the on-page `Routelist` templates in the live wikitext currently expand to **92** SH rows. Discrepancies are a Wikipedia content issue, not this repo.

---

## RJ SH 1 (6 km)

**Corridor (Wikipedia):** Jhalawar (MP. Border) to Mathura (UP Border) via Jhalarapatan, Jhalawar, Baran, Mangrol, Itawah, Genta(गैंता)-Maakhida (A Rajasthan's longest Bridge on Chambal river, Laban, Lakheri, Indergarh, Sawai Madhopur, Bhadoti, Gangapur City, Suroth, Hindaun, Bayana, Bharatpur.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 178 | Daulatpura Fee Plaza (KOTA) | nhai | 552 | sawai, madhopur |
| 599 | Gumanpura | nhai | 116 | sawai, madhopur |
| 148 | Amoli | nhai | 11 (New 21) | bharatpur |
| 732 | Beermandi | nhai | 52 | jhalawar |
| 12 | Fatehpur | nhai | 27 | baran |
| 92 | Korai | nhai | 11 (New 21) | bharatpur |
| 1050 | Laban ( Close Loop Toll ) | nhai | NE- 4 | laban |
| 82 | Ludhawai | nhai | 11 (New 21) | bharatpur |
| 331 | Methoon | nhai | 52 | jhalawar |
| 13 | Simliya | nhai | 27 | baran |

## RJ SH 2 (210 km)

**Corridor (Wikipedia):** Dausa to Kuchaman via Lawan, Tunga, Chaksu, Phagi, Mozmabad, Dudu, Sambhar, Nawan, Palari, Kuchaman City.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 2102 | Jaipur-Bhilwara State Highway Toll Plaza | state |  | phagi |
| 719 | Nekawala | nhai | 11A  (New 148) | dausa |
| 720 | Rabawata | nhai | 11A | dausa |
| 1184 | Shyamsinghpura Virtual (Close Loop Toll) | nhai | NE-4C | dausa |
| 721 | Titoli | nhai | 11 | dausa |

## RJ SH 2A (44 km)

**Corridor (Wikipedia):** Dholpur (NH 3) to Rajakhera up to State Border

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 373 | Chila Chond | nhai | 11B | dholpur |
| 372 | Konder | nhai | 11B | dholpur |
| 677 | Rajorakhurd | nhai | 123 | dholpur |

## RJ SH 2B (53 km)

**Corridor (Wikipedia):** Palari to Khatu via Managlana, Makrana.

**Toll plazas (this dataset, heuristic):** *none matched by place-token overlap.* May still have tolls on this corridor — verify with maps / RSRDC / field.

## RJ SH 2C (78 km)

**Corridor (Wikipedia):** Jaipur to Nawan via Jobner, Pachkodiya

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 1224 | Bagrana  (Close Loop Toll ) | nhai | NE-4C | jaipur |
| 150 | Barkheda (Chandlai) | nhai | 52 | jaipur |
| 1185 | Bedoli (Close Loop Toll ) | nhai | NE-4C | jaipur |
| 1203 | Daulatpura Toll Plaza (JAI) | nhai | 48 | jaipur |
| 1183 | Geela Ki Nangal (Close Loop Toll) | nhai | NE-4C | jaipur |
| 2102 | Jaipur-Bhilwara State Highway Toll Plaza | state |  | jaipur |
| 940 | Jaitpur TP4 (Jaipur) (Close Loop Toll) | nhai | 754K (New 754A) | jaipur |
| 1186 | Khurikhud (Close Loop Toll) | nhai | NE-4C | jaipur |
| 95 | Kishangarh (Badgaon) | nhai | 48 | jaipur |
| 177 | Manoharpur | nhai | 48 | jaipur |
| 147 | Rajadhok | nhai | 11 (New 21) | jaipur |
| 176 | Shahjahanpur | nhai | 48 | jaipur |
| 1184 | Shyamsinghpura Virtual (Close Loop Toll) | nhai | NE-4C | jaipur |
| 146 | Sikandra | nhai | 11 (New 21) | jaipur |
| 2101 | Sitarampura Toll Plaza | state |  | jaipur |
| 151 | Sonwa (Sonva) | nhai | 52 | jaipur |
| 1182 | Sundarpura (Close Loop Toll) | nhai | NE-4C | jaipur |
| 97 | Tatiyawas | nhai | 52 | jaipur |
| 149 | Thikariya (Jaipur) | nhai | 48 | jaipur |

## RJ SH 3 (267.2 km)

**Corridor (Wikipedia):** Ganganagar to Bikaner via Chunawadh, Padampur, Gajsinghpur, Raisinghnagar, Anupgarh, Gharsana, Chattargarh.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 1220 | 3M Toll Plaza | nhai | 911 | ganganagar, raisinghnagar |
| 381 | 6ML (Sixml) Toll Plaza | nhai | 62 | ganganagar |
| 1196 | Badhera(Bhadera ) Toll Plaza | nhai | 62 | bikaner |
| 1145 | Chohilanwali TP3 (Close Loop Toll) | nhai | 754K (New 754A) | bikaner |
| 944 | Deshnok TP8  (Close Loop Toll) | nhai | 754K (New 754A) | bikaner |
| 1197 | Hindore Toll Plaza | nhai | 62 | ganganagar |
| 940 | Jaitpur TP4 (Jaipur) (Close Loop Toll) | nhai | 754K (New 754A) | bikaner |
| 1195 | Khara | nhai | 62 | bikaner |
| 781 | Kheerwa | nhai | 15(New 11) | bikaner |
| 862 | Lakhasar | nhai | 11 | bikaner |
| 941 | Malkisar  TP5 (Close Loop Toll) | nhai | 754K (New 754A) | bikaner |
| 859 | Nimbaheda | nhai | 79 | bikaner |
| 449 | Nokhra | nhai | 15(New 11) | bikaner |
| 943 | Norangdesar  TP7 (Close Loop Toll) | nhai | 754K (New 754A) | bikaner |
| 858 | Ochadi | nhai | 79 | bikaner |
| 989 | Panchu  TP9 (Close Loop Toll) | nhai | 754A | bikaner |
| 939 | Parwa | nhai | 89 (New 62) | bikaner |
| 860 | Rashidpura | nhai | 11 | bikaner |
| 448 | Salasar | nhai | 15(New 11) | bikaner |
| 1144 | Sangariya TP1 (Close Loop Toll) | nhai | 754K (New 754A) | bikaner |
| 1133 | Thakri (Raisinghnagar) Toll plaza | nhai | 911 | raisinghnagar |
| 861 | Tidiayasar | nhai | 11 | bikaner |
| 942 | Uchharangdesar  TP6 (Close Loop Toll) | nhai | 754K (New 754A) | bikaner |
| 863 | Udairamsar | nhai | 11 (New 89) | bikaner |

## RJ SH 6 (159.6 km)

**Corridor (Wikipedia):** Dungargarh (NH 11) to Rajgarh via Sardarshahar, Taranagar.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 722 | Thirpali Bari | nhai | 709(E) | rajgarh |

## RJ SH 6A (137 km)

**Corridor (Wikipedia):** Sawai Bari (SH-6) to Sattasar via Varsisar, Lunkaransar

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 1196 | Badhera(Bhadera ) Toll Plaza | nhai | 62 | lunkaransar |
| 178 | Daulatpura Fee Plaza (KOTA) | nhai | 552 | sawai |
| 599 | Gumanpura | nhai | 116 | sawai |
| 104 | Khandi Obari | nhai | 48 | bari |
| 862 | Lakhasar | nhai | 11 | bari |
| 859 | Nimbaheda | nhai | 79 | lunkaransar |
| 858 | Ochadi | nhai | 79 | lunkaransar |
| 860 | Rashidpura | nhai | 11 | bari |
| 722 | Thirpali Bari | nhai | 709(E) | bari |
| 861 | Tidiayasar | nhai | 11 | bari |

## RJ SH 7 (409.05 km)

**Corridor (Wikipedia):** Kishangarh to Sangaria via Roopangarh, Parbatsar, Manglana, Kuchaman City, Losal, Salasar, Ratangarh, Sardarshahar, Pallu, Rawatsar, Hanumangarh.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 383 | Dhadhar | nhai | 52 | salasar |
| 309 | Gegal | nhai | 8 | kishangarh |
| 428 | Harimma | nhai | 58 | salasar |
| 756 | Khedi | nhai |  79 , 79A | kishangarh |
| 95 | Kishangarh (Badgaon) | nhai | 48 | kishangarh |
| 382 | Lasedi | nhai | 52 | salasar |
| 429 | Nimbi Jodha | nhai | 58 | salasar |
| 310 | Pipalaz | nhai | 8 | kishangarh |
| 1160 | Pipalwas Plaza | nhai | 58E | kishangarh |
| 448 | Salasar | nhai | 15(New 11) | salasar |
| 384 | Shobhasar | nhai | 52 | salasar |
| 149 | Thikariya (Jaipur) | nhai | 48 | kishangarh |

## RJ SH 7A (42.7 km)

**Corridor (Wikipedia):** Hanumangarh to Abohar via Sadulshahar.

**Toll plazas (this dataset, heuristic):** *none matched by place-token overlap.* May still have tolls on this corridor — verify with maps / RSRDC / field.

## RJ SH 7B (85 km)

**Corridor (Wikipedia):** Sadulshahar Ganganagar, Mirzawala, Karanpur.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 1220 | 3M Toll Plaza | nhai | 911 | ganganagar |
| 381 | 6ML (Sixml) Toll Plaza | nhai | 62 | ganganagar |
| 1197 | Hindore Toll Plaza | nhai | 62 | ganganagar |

## RJ SH 7C (37 km)

**Corridor (Wikipedia):** Ratangarh to Talchhapar.

**Toll plazas (this dataset, heuristic):** *none matched by place-token overlap.* May still have tolls on this corridor — verify with maps / RSRDC / field.

## RJ SH 7D (72 km)

**Corridor (Wikipedia):** Ranasar (SH-7) to Ladnun via Daulatpura, Didwana

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 178 | Daulatpura Fee Plaza (KOTA) | nhai | 552 | daulatpura |
| 1203 | Daulatpura Toll Plaza (JAI) | nhai | 48 | daulatpura |

## RJ SH 7E (71 km)

**Corridor (Wikipedia):** Sarwar to Kishangarh via Arai

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 309 | Gegal | nhai | 8 | kishangarh |
| 756 | Khedi | nhai |  79 , 79A | kishangarh |
| 95 | Kishangarh (Badgaon) | nhai | 48 | kishangarh |
| 310 | Pipalaz | nhai | 8 | kishangarh |
| 1160 | Pipalwas Plaza | nhai | 58E | kishangarh |
| 149 | Thikariya (Jaipur) | nhai | 48 | kishangarh |

## RJ SH 8 (124 km)

**Corridor (Wikipedia):** Sikar to Luharu up to State Border via Nawalgarh, Mukandgarh, Jhunjhunu, Baggar, Chirawa, Surajargh.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 305 | Akhepura | nhai | 52 | sikar |
| 1025 | Baggad | nhai | 8 | baggar |
| 862 | Lakhasar | nhai | 11 | sikar |
| 860 | Rashidpura | nhai | 11 | sikar |
| 861 | Tidiayasar | nhai | 11 | sikar |
| 863 | Udairamsar | nhai | 11 (New 89) | sikar |

## RJ SH 8A (86 km)

**Corridor (Wikipedia):** Sikar to Pachkodia via Lalas, Ghatwa, Danta, Ramgarh, Renwal.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 305 | Akhepura | nhai | 52 | sikar |
| 862 | Lakhasar | nhai | 11 | sikar |
| 1261 | Ramgarh Toll Plaza | nhai | 68 | ramgarh |
| 860 | Rashidpura | nhai | 11 | sikar |
| 861 | Tidiayasar | nhai | 11 | sikar |
| 863 | Udairamsar | nhai | 11 (New 89) | sikar |

## RJ SH 8B (25.5 km)

**Corridor (Wikipedia):** Jatawali to Kaladera via Chomu

**Toll plazas (this dataset, heuristic):** *none matched by place-token overlap.* May still have tolls on this corridor — verify with maps / RSRDC / field.

## RJ SH 9 (99.8 km)

**Corridor (Wikipedia):** Dabok (NH 76) to Chittaurgarh via Mavli, Bhopalsagar, Kapasan.

**Toll plazas (this dataset, heuristic):** *none matched by place-token overlap.* May still have tolls on this corridor — verify with maps / RSRDC / field.

## RJ SH 9A (125.8 km)

**Corridor (Wikipedia):** Katunda to Shri Chhatarpura via Bharodia, Cheechat, Ramganj Mandi.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 732 | Beermandi | nhai | 52 | mandi |
| 986 | Sirmandi TP 13(Close Loop Toll) | nhai | 754A | mandi |

## RJ SH 9B (11 km)

**Corridor (Wikipedia):** Suket to Ramganj Mandi.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 732 | Beermandi | nhai | 52 | mandi |
| 986 | Sirmandi TP 13(Close Loop Toll) | nhai | 754A | mandi |

## RJ SH 10 (315 km)

**Corridor (Wikipedia):** Swaroopganj (Junction of NH 14) to Ratlam up to State Border via Royada, Kotada, Kherwara, Dungarpur, Sagwara, Garhi, Banswara, Danpur.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 1163 | Padla Hadliya Plaza | nhai | 927A | dungarpur, sagwara |
| 914 | Dungarpur (Entry Exit ) Toll | nhai | NE- 4 | dungarpur |
| 100 | Gogunda (Jaswantgarh) | nhai | 27 | swaroopganj |
| 106 | Malera | nhai | 27 | swaroopganj |

## RJ SH 11 (108 km)

**Corridor (Wikipedia):** Sanchore(NH 15) to Abu Road via Raniwara Kalan, Mandar

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 718 | Biratiya Kalan | nhai | 25 | kalan |
| 427 | Bor Charnan | nhai | 68 | sanchore |
| 715 | Chhoti Villor | nhai | 168A | sanchore |
| 426 | Hathitala | nhai | 68 | sanchore |
| 152 | Lambia Kalan | nhai | 79 | kalan |

## RJ SH 12 (324.2 km)

**Corridor (Wikipedia):** Sanganer to Kankroli via Phagi, Diggi, Malpura, Sawariya, Kekri, Shahpura, Mandal, Bhilwara.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 2102 | Jaipur-Bhilwara State Highway Toll Plaza | state |  | phagi, bhilwara |
| 995 | Dhulepura | nhai | 158 | bhilwara |
| 601 | Khachrol (Hoda) | nhai | 758 | bhilwara |
| 379 | Rupakheda | nhai | 758 | bhilwara |

## RJ SH 13 (329.6 km)

**Corridor (Wikipedia):** Alwar to Rajgarh via Kushalgarh, Talvarksh, Narayanpur, Thanagazi, Ghata Bhandrol, Shahpura, Kanwat, Neem ka Thana, Khetri, Singhana, Chrawa, Pilani.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 783 | Bahala | nhai | 248 A | alwar |
| 105 | Narayanpura | nhai | 76 | narayanpur |
| 722 | Thirpali Bari | nhai | 709(E) | rajgarh |

## RJ SH 14 (165.1 km)

**Corridor (Wikipedia):** Bharatpur to Narnaul (State Border) via Deeg, Nagar, Meo ka Baroda, Baggar ka Tiraha, Alwar, Jindoli, Tatarpur, Sodawas, Barrod, Behror, Narnaul

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 148 | Amoli | nhai | 11 (New 21) | bharatpur |
| 1025 | Baggad | nhai | 8 | baggar |
| 783 | Bahala | nhai | 248 A | alwar |
| 92 | Korai | nhai | 11 (New 21) | bharatpur |
| 82 | Ludhawai | nhai | 11 (New 21) | bharatpur |

## RJ SH 15 (77 km)

**Corridor (Wikipedia):** Mangalwar to Neemach up to State border via Dungala, Bari Sadri, Chhoti Sadri.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 715 | Chhoti Villor | nhai | 168A | chhoti |
| 104 | Khandi Obari | nhai | 48 | bari |
| 862 | Lakhasar | nhai | 11 | bari |
| 860 | Rashidpura | nhai | 11 | bari |
| 722 | Thirpali Bari | nhai | 709(E) | bari |
| 861 | Tidiayasar | nhai | 11 | bari |

## RJ SH 16 (276 km)

**Corridor (Wikipedia):** Chawa to Amritia (NH 8) via Sindhari, Jalore, Takhatgarh, Sanderao, Sadri, Desuri.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 598 | Narsana | nhai | 325 | sanderao |

## RJ SH 19 (368 km)

**Corridor (Wikipedia):** Phalodi (NH 15) to Needar via Ahu, Chadi, Pachudi, Nagaur, Tarneu, Khatu Kalan, Khatu khurd, Toshina, Kuchaman City, Bhuni, Maroth, Deoli Minda, Renwal Crossing, Kaladera.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 550 | Badighati | nhai | 89 | nagaur |
| 150 | Barkheda (Chandlai) | nhai | 52 | deoli |
| 718 | Biratiya Kalan | nhai | 25 | kalan |
| 549 | Butati (Kuchera) | nhai | 89 | nagaur |
| 945 | Dangiyawas | nhai | 125A | nagaur |
| 428 | Harimma | nhai | 58 | nagaur |
| 781 | Kheerwa | nhai | 15(New 11) | phalodi |
| 340 | Kishorpura | nhai | 52 | deoli |
| 152 | Lambia Kalan | nhai | 79 | kalan |
| 445 | Lathi | nhai | 15
(New 11) | phalodi |
| 946 | Manaklavo | nhai | 125A | nagaur |
| 682 | Netra | nhai | 62 | nagaur |
| 429 | Nimbi Jodha | nhai | 58 | nagaur |
| 449 | Nokhra | nhai | 15(New 11) | phalodi |
| 858 | Ochadi | nhai | 79 | chadi |
| 677 | Rajorakhurd | nhai | 123 | khurd |
| 444 | Ramdevra | nhai | 15(New 11) | phalodi |
| 448 | Salasar | nhai | 15(New 11) | phalodi |
| 151 | Sonwa (Sonva) | nhai | 52 | deoli |
| 681 | Tankla | nhai | 62 | nagaur |

## RJ SH 19A (121 km)

**Corridor (Wikipedia):** Jhalawar to Agar(State Border)`via Pipliya, Suliya, Bhawani Mandi, Dug

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 732 | Beermandi | nhai | 52 | jhalawar, mandi |
| 986 | Sirmandi TP 13(Close Loop Toll) | nhai | 754A | agar, mandi |
| 1220 | 3M Toll Plaza | nhai | 911 | agar |
| 381 | 6ML (Sixml) Toll Plaza | nhai | 62 | agar |
| 1115 | Asada Ki Beri | nhai | 25E | agar |
| 988 | Bungri  TP10 (Close Loop Toll) | nhai | 754A | agar |
| 1145 | Chohilanwali TP3 (Close Loop Toll) | nhai | 754K (New 754A) | agar |
| 1099 | Dadal TP 20 (Close Loop Toll) | nhai | 754 A | agar |
| 984 | Deogarh TP15 (Close Loop Toll) | nhai | 754A | agar |
| 1146 | Deora TP 21 (Close Loop Toll) | nhai | 754A | agar |
| 944 | Deshnok TP8  (Close Loop Toll) | nhai | 754K (New 754A) | agar |
| 1197 | Hindore Toll Plaza | nhai | 62 | agar |
| 322 | Indranagar | nhai | 162 | agar |
| 940 | Jaitpur TP4 (Jaipur) (Close Loop Toll) | nhai | 754K (New 754A) | agar |
| 1180 | Jajoosan TP 22 (Close Loop Toll) | nhai | 754A | agar |
| 389 | Jasnathnagar | nhai | 114 | agar |
| 987 | Jathon Ki Dhani ( Hanuman Sagar ) TP 12 (Close Loop Toll) | nhai | 754A | agar |
| 985 | Khudiyala TP 14 (Close Loop Toll) | nhai | 754A | agar |
| 1051 | Laxamannagar TP 11  (Close Loop Toll) | nhai | 754A | agar |
| 941 | Malkisar  TP5 (Close Loop Toll) | nhai | 754K (New 754A) | agar |
| 983 | Meghawas  TP 16 (Close Loop Toll) | nhai | 754A | agar |
| 331 | Methoon | nhai | 52 | jhalawar |
| 1179 | Mokhupura TP23 (Close Loop Toll) | nhai | 754A | agar |
| 980 | Moothli  TP18  (Close Loop Toll) | nhai | 754A | agar |
| 943 | Norangdesar  TP7 (Close Loop Toll) | nhai | 754K (New 754A) | agar |
| 989 | Panchu  TP9 (Close Loop Toll) | nhai | 754A | agar |
| 982 | Patau  TP17 (Close Loop Toll) | nhai | 754A | agar |
| 981 | Sangana  TP19 (Close Loop Toll) | nhai | 754A | agar |
| 1144 | Sangariya TP1 (Close Loop Toll) | nhai | 754K (New 754A) | agar |
| 1133 | Thakri (Raisinghnagar) Toll plaza | nhai | 911 | agar |
| 942 | Uchharangdesar  TP6 (Close Loop Toll) | nhai | 754K (New 754A) | agar |

## RJ SH 19B (14.7 km)

**Corridor (Wikipedia):** Mangrol (SH-1) to Rajpura via Bamori Kalan

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 718 | Biratiya Kalan | nhai | 25 | kalan |
| 152 | Lambia Kalan | nhai | 79 | kalan |

## RJ SH 20 (172.1 km)

**Corridor (Wikipedia):** Sikar to Nokha via Salasar, Sujangarh, Talchhapar.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 305 | Akhepura | nhai | 52 | sikar |
| 383 | Dhadhar | nhai | 52 | salasar |
| 1016 | Gogela fee Plaza | nhai | 89 (New 62) | nokha |
| 428 | Harimma | nhai | 58 | salasar |
| 862 | Lakhasar | nhai | 11 | sikar |
| 382 | Lasedi | nhai | 52 | salasar |
| 429 | Nimbi Jodha | nhai | 58 | salasar |
| 939 | Parwa | nhai | 89 (New 62) | nokha |
| 860 | Rashidpura | nhai | 11 | sikar |
| 448 | Salasar | nhai | 15(New 11) | salasar |
| 384 | Shobhasar | nhai | 52 | salasar |
| 861 | Tidiayasar | nhai | 11 | sikar |
| 863 | Udairamsar | nhai | 11 (New 89) | sikar |

## RJ SH 20A (58 km)

**Corridor (Wikipedia):** Bidasar to Ganeri via Jaswantgarh.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 100 | Gogunda (Jaswantgarh) | nhai | 27 | jaswantgarh |

## RJ SH 20B (143 km)

**Corridor (Wikipedia):** Bikaner to Ladnun via Napasar, Jasrasar

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 1196 | Badhera(Bhadera ) Toll Plaza | nhai | 62 | bikaner |
| 1145 | Chohilanwali TP3 (Close Loop Toll) | nhai | 754K (New 754A) | bikaner |
| 944 | Deshnok TP8  (Close Loop Toll) | nhai | 754K (New 754A) | bikaner |
| 940 | Jaitpur TP4 (Jaipur) (Close Loop Toll) | nhai | 754K (New 754A) | bikaner |
| 1195 | Khara | nhai | 62 | bikaner |
| 781 | Kheerwa | nhai | 15(New 11) | bikaner |
| 862 | Lakhasar | nhai | 11 | bikaner |
| 941 | Malkisar  TP5 (Close Loop Toll) | nhai | 754K (New 754A) | bikaner |
| 859 | Nimbaheda | nhai | 79 | bikaner |
| 449 | Nokhra | nhai | 15(New 11) | bikaner |
| 943 | Norangdesar  TP7 (Close Loop Toll) | nhai | 754K (New 754A) | bikaner |
| 858 | Ochadi | nhai | 79 | bikaner |
| 989 | Panchu  TP9 (Close Loop Toll) | nhai | 754A | bikaner |
| 939 | Parwa | nhai | 89 (New 62) | bikaner |
| 860 | Rashidpura | nhai | 11 | bikaner |
| 448 | Salasar | nhai | 15(New 11) | bikaner |
| 1144 | Sangariya TP1 (Close Loop Toll) | nhai | 754K (New 754A) | bikaner |
| 861 | Tidiayasar | nhai | 11 | bikaner |
| 942 | Uchharangdesar  TP6 (Close Loop Toll) | nhai | 754K (New 754A) | bikaner |
| 863 | Udairamsar | nhai | 11 (New 89) | bikaner |

## RJ SH 21 (96.4 km)

**Corridor (Wikipedia):** Dantiweara to Merta City via Pipar City, Borunda.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 377 | Banthadi | nhai | 458 | merta, merta city |
| 769 | Tamdoli | nhai | 458 | merta, merta city |

## RJ SH 21A (60 km)

**Corridor (Wikipedia):** Parbatsar to NH 89 Junction via Piplad, Bagaut, Harsore, Bherunda, Dodiyana.

**Toll plazas (this dataset, heuristic):** *none matched by place-token overlap.* May still have tolls on this corridor — verify with maps / RSRDC / field.

## RJ SH 22 (194.7 km)

**Corridor (Wikipedia):** Mandrayal to Pahadi up to State Border via Karauli, Hindaun, Mahuwa, Kathoomar Kherli, Nagar.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 373 | Chila Chond | nhai | 11B | karauli |
| 372 | Konder | nhai | 11B | karauli |

## RJ SH 23 (63.2 km)

**Corridor (Wikipedia):** Bharatpur(NH 11-Uncha Nagala)to Dhaulpur (NH 11B)via Roopwas, Sepau.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 148 | Amoli | nhai | 11 (New 21) | bharatpur |
| 92 | Korai | nhai | 11 (New 21) | bharatpur |
| 82 | Ludhawai | nhai | 11 (New 21) | bharatpur |
| 677 | Rajorakhurd | nhai | 123 | roopwas |

## RJ SH 24 (122 km)

**Corridor (Wikipedia):** Bhadoti Mod (SH-1) to Bassi via Junction of NH 11B Lalsot, Tunga

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 9 | Bassi | nhai | 27 | bassi |
| 720 | Rabawata | nhai | 11A | lalsot |
| 721 | Titoli | nhai | 11 | lalsot |

## RJ SH 25 (225 km)

**Corridor (Wikipedia):** Daruhera to Gangapur City via Bhiwadi, Tapookara, Tijara, Kishangarh Bas, Alwar, Rajgarh, Bandikui, Sikandara, Nadoti

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 783 | Bahala | nhai | 248 A | alwar |
| 309 | Gegal | nhai | 8 | kishangarh |
| 756 | Khedi | nhai |  79 , 79A | kishangarh |
| 95 | Kishangarh (Badgaon) | nhai | 48 | kishangarh |
| 310 | Pipalaz | nhai | 8 | kishangarh |
| 1160 | Pipalwas Plaza | nhai | 58E | kishangarh |
| 149 | Thikariya (Jaipur) | nhai | 48 | kishangarh |
| 722 | Thirpali Bari | nhai | 709(E) | rajgarh |

## RJ SH 25A (62.5 km)

**Corridor (Wikipedia):** Tehala to GaRhi Sawai Ram Via Rajgarh (SH-35)

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 178 | Daulatpura Fee Plaza (KOTA) | nhai | 552 | sawai |
| 599 | Gumanpura | nhai | 116 | sawai |
| 722 | Thirpali Bari | nhai | 709(E) | rajgarh |

## RJ SH 26 (99 km)

**Corridor (Wikipedia):** Nasirabad to Deoli (SH-12) via Kekri

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 150 | Barkheda (Chandlai) | nhai | 52 | deoli |
| 340 | Kishorpura | nhai | 52 | deoli |
| 151 | Sonwa (Sonva) | nhai | 52 | deoli |

## RJ SH 27 (72 km)

**Corridor (Wikipedia):** Sirohi (NH 14) to Deesa up to District Border via Mandar

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 550 | Badighati | nhai | 89 | district |
| 267 | Bagaliya | nhai | 80 | district |
| 377 | Banthadi | nhai | 458 | district |
| 549 | Butati (Kuchera) | nhai | 89 | district |
| 715 | Chhoti Villor | nhai | 168A | deesa |
| 309 | Gegal | nhai | 8 | district |
| 938 | Jaswantpura | nhai | 158 | district |
| 756 | Khedi | nhai |  79 , 79A | district |
| 1260 | Lanela Toll Plaza | nhai | 68 | district |
| 355 | Lilamba | nhai | 458 | district |
| 493 | Mandana (Kota) | nhai | 52 | district |
| 1205 | Para Toll Plaza | nhai | 148D | district |
| 1262 | Parewar Toll Plaza | nhai | 968 | district |
| 310 | Pipalaz | nhai | 8 | district |
| 1261 | Ramgarh Toll Plaza | nhai | 68 | district |
| 769 | Tamdoli | nhai | 458 | district |

## RJ SH 28 (259 km)

**Corridor (Wikipedia):** Phalodi (NH 15) to Ramji ki Gol via Dechu, Shergarh, Pachpadra, Balotra, Sindri, Guda Malani.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 716 | Balana | nhai | 325 | balotra |
| 378 | Doli | nhai | 112 | pachpadra |
| 781 | Kheerwa | nhai | 15(New 11) | phalodi |
| 445 | Lathi | nhai | 15
(New 11) | phalodi |
| 449 | Nokhra | nhai | 15(New 11) | phalodi |
| 444 | Ramdevra | nhai | 15(New 11) | phalodi |
| 448 | Salasar | nhai | 15(New 11) | phalodi |

## RJ SH 28B (24 km)

**Corridor (Wikipedia):** Pachpadra (NH 112) to Bagundi

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 378 | Doli | nhai | 112 | pachpadra |
| 361 | Nimbaniya Ki Dhani (Bayatu) | nhai | 25 | bagundi |

## RJ SH 29 (139 km)

**Corridor (Wikipedia):** Uniara(NH 116) to Bijoliya (NH 76) via Bundi, Indergarh, Lakheri up to NH 76

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 521 | Kadisahena | nhai | 148D | uniara |
| 522 | Lal Ka Khera | nhai | 148D | uniara |
| 523 | Pallai | nhai | 148D | uniara |

## RJ SH 29A (20.5 km)

**Corridor (Wikipedia):** Sariska Palace to Tehla (Km.20.5) to via Pandupole

**Toll plazas (this dataset, heuristic):** *none matched by place-token overlap.* May still have tolls on this corridor — verify with maps / RSRDC / field.

## RJ SH 29B (44.00 km)

**Corridor (Wikipedia):** Bundi to Nainwa

**Toll plazas (this dataset, heuristic):** *none matched by place-token overlap.* May still have tolls on this corridor — verify with maps / RSRDC / field.

## RJ SH 30 (34 km)

**Corridor (Wikipedia):** Sawai Madhopur(NH 116) to Palighat up to State Border.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 178 | Daulatpura Fee Plaza (KOTA) | nhai | 552 | sawai, madhopur |
| 599 | Gumanpura | nhai | 116 | sawai, madhopur |

## RJ SH 31 (107 km)

**Corridor (Wikipedia):** Jalore(SH-16) to Raniwara Kalan(SH- 11) via Ramseen Bhinmal

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 718 | Biratiya Kalan | nhai | 25 | kalan |
| 152 | Lambia Kalan | nhai | 79 | kalan |

## RJ SH 32 (219 km)

**Corridor (Wikipedia):** Sadri (SH-16-62) to Banswara via Ranakpur, Gogunda, Udaipur, Salumbar Aspur, Sabala, Lohariya, Ganoda.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 100 | Gogunda (Jaswantgarh) | nhai | 27 | gogunda, udaipur |
| 1213 | Dakan Kotra | nhai | 48 | udaipur |
| 104 | Khandi Obari | nhai | 48 | udaipur |
| 106 | Malera | nhai | 27 | udaipur |
| 341 | Mandawada (Gomati) | nhai | 58 | udaipur |
| 105 | Narayanpura | nhai | 76 | udaipur |
| 342 | Negadiya | nhai | 58 | udaipur |

## RJ SH 33 (116 km)

**Corridor (Wikipedia):** Rawatbhata (SH-9A) to Laban via Kota, Keshoraipatan, Kapren.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 10 | Aroli | nhai | 27 | kota |
| 550 | Badighati | nhai | 89 | kota |
| 267 | Bagaliya | nhai | 80 | kota |
| 377 | Banthadi | nhai | 458 | kota |
| 9 | Bassi | nhai | 27 | kota |
| 549 | Butati (Kuchera) | nhai | 89 | kota |
| 178 | Daulatpura Fee Plaza (KOTA) | nhai | 552 | kota |
| 11 | Dhaneshwar | nhai | 27 | kota |
| 12 | Fatehpur | nhai | 27 | kota |
| 309 | Gegal | nhai | 8 | kota |
| 938 | Jaswantpura | nhai | 158 | kota |
| 756 | Khedi | nhai |  79 , 79A | kota |
| 340 | Kishorpura | nhai | 52 | kota |
| 417 | Kota Bypass (Sakatpura ) | nhai | 27 | kota |
| 1050 | Laban ( Close Loop Toll ) | nhai | NE- 4 | laban |
| 355 | Lilamba | nhai | 458 | kota |
| 493 | Mandana (Kota) | nhai | 52 | kota |
| 380 | Mujras | nhai | 758 | kota |
| 1205 | Para Toll Plaza | nhai | 148D | kota |
| 310 | Pipalaz | nhai | 8 | kota |
| 13 | Simliya | nhai | 27 | kota |
| 769 | Tamdoli | nhai | 458 | kota |

## RJ SH 34 (112.8 km)

**Corridor (Wikipedia):** Tonk to Keshoraipatan via Nagar, Nainwa, Khatkad.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 599 | Gumanpura | nhai | 116 | tonk |
| 546 | Hingonia | nhai | 148 | tonk |
| 547 | Sitarampura | nhai | 148 | tonk |

## RJ SH 35 (66.1 km)

**Corridor (Wikipedia):** Mahuwa to Govindgarh (SH-45) via Mandawar Gadhi Sawai Ram, Laxmangarh.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 178 | Daulatpura Fee Plaza (KOTA) | nhai | 552 | sawai |
| 599 | Gumanpura | nhai | 116 | sawai |
| 862 | Lakhasar | nhai | 11 | laxmangarh |
| 650 | Mandawara ( Close Loop Toll ) | nhai | NE- 4 | mandawar |
| 860 | Rashidpura | nhai | 11 | laxmangarh |
| 861 | Tidiayasar | nhai | 11 | laxmangarh |

## RJ SH 36 (242.1 km)

**Corridor (Wikipedia):** Churu (NH 52) to Ganganagar via Taranagar, Sahawa, Nohar, Thaladaka, Munda, Hanumangarh, Lalgarh.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 1220 | 3M Toll Plaza | nhai | 911 | ganganagar |
| 381 | 6ML (Sixml) Toll Plaza | nhai | 62 | ganganagar |
| 1197 | Hindore Toll Plaza | nhai | 62 | ganganagar |
| 177 | Manoharpur | nhai | 48 | nohar |
| 719 | Nekawala | nhai | 11A  (New 148) | nohar |

## RJ SH 37 ( km)

**Corridor (Wikipedia):** Chomu (NH 52) to Churu via Ajeetgarh Shrimadhopur, Khendela, Udaipurwati

**Toll plazas (this dataset, heuristic):** *none matched by place-token overlap.* May still have tolls on this corridor — verify with maps / RSRDC / field.

## RJ SH 37A (229.9 km)

**Corridor (Wikipedia):** Dudu to Manohar Thana via Malpura, Todaraisingh, Tonk, Nagar, Nainwa, Khatgarh, Kapren, Barod, Siswali, Baran.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 12 | Fatehpur | nhai | 27 | baran |
| 599 | Gumanpura | nhai | 116 | tonk |
| 546 | Hingonia | nhai | 148 | tonk |
| 177 | Manoharpur | nhai | 48 | manohar |
| 719 | Nekawala | nhai | 11A  (New 148) | manohar |
| 13 | Simliya | nhai | 27 | baran |
| 547 | Sitarampura | nhai | 148 | tonk |

## RJ SH 37B (141.5 km)

**Corridor (Wikipedia):** Kotputli (NH 8) to Losal (SH-7) via Patan, Neem ka Thana, Chala, Udaipurwati, Sikar, Dhod.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 305 | Akhepura | nhai | 52 | sikar |
| 1203 | Daulatpura Toll Plaza (JAI) | nhai | 48 | kotputli |
| 862 | Lakhasar | nhai | 11 | sikar |
| 177 | Manoharpur | nhai | 48 | kotputli |
| 860 | Rashidpura | nhai | 11 | sikar |
| 176 | Shahjahanpur | nhai | 48 | kotputli |
| 861 | Tidiayasar | nhai | 11 | sikar |
| 863 | Udairamsar | nhai | 11 (New 89) | sikar |

## RJ SH 37C (23.9 km)

**Corridor (Wikipedia):** Udaipuriya Mod (NH 52) to Mundru shrimadhopur (SH-37) via Khejroli

**Toll plazas (this dataset, heuristic):** *none matched by place-token overlap.* May still have tolls on this corridor — verify with maps / RSRDC / field.

## RJ SH 38 (111.5 km)

**Corridor (Wikipedia):** Sirohi (NH 14) to Balotra (NH 112) via Jawal, Kalandri, Ramseen, Jalore, Makalsar, Siwana.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 716 | Balana | nhai | 325 | balotra |

## RJ SH 39 (318 km)

**Corridor (Wikipedia):** Satur (NH 12) to Mundwa via Jahajpur, Shahpura, Vijaynagar, Beawar, Merta City, Lambia, Merta Road, Khajwana.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 377 | Banthadi | nhai | 458 | merta, merta city |
| 769 | Tamdoli | nhai | 458 | merta, merta city |
| 1025 | Baggad | nhai | 8 | beawar |
| 323 | Birami | nhai | 62 | beawar |
| 309 | Gegal | nhai | 8 | beawar |
| 322 | Indranagar | nhai | 162 | beawar |
| 938 | Jaswantpura | nhai | 158 | beawar |
| 152 | Lambia Kalan | nhai | 79 | lambia |
| 355 | Lilamba | nhai | 458 | lambia |
| 310 | Pipalaz | nhai | 8 | beawar |
| 1160 | Pipalwas Plaza | nhai | 58E | beawar |
| 321 | Raipur | nhai | 62 | beawar |
| 324 | Uthamam | nhai | 14 | beawar |

## RJ SH 40 (342 km)

**Corridor (Wikipedia):** Gadara road to Nachana via Pokharan, Barmer, Chawa, Baytoo, Kanod, Phalsoond, Miniyana, Pokharan.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 1115 | Asada Ki Beri | nhai | 25E | barmer |
| 427 | Bor Charnan | nhai | 68 | barmer |
| 426 | Hathitala | nhai | 68 | barmer |
| 494 | Kair Fakir Ki Dhani | nhai | 68 | barmer |
| 361 | Nimbaniya Ki Dhani (Bayatu) | nhai | 25 | barmer |
| 597 | Nimbasar | nhai | 68 | barmer |

## RJ SH 41 (111.2 km)

**Corridor (Wikipedia):** Fatehpur to Rajgarh via Jhunjhunun, Alsisar, Malsisar.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 383 | Dhadhar | nhai | 52 | fatehpur |
| 12 | Fatehpur | nhai | 27 | fatehpur |
| 382 | Lasedi | nhai | 52 | fatehpur |
| 384 | Shobhasar | nhai | 52 | fatehpur |
| 722 | Thirpali Bari | nhai | 709(E) | rajgarh |

## RJ SH 42 (37 km)

**Corridor (Wikipedia):** Bari (NH 11B) to Kheragarh up to Stat Border via Saipau, Basai Nawab.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 10 | Aroli | nhai | 27 | stat |
| 1209 | Badkapara (Close Loop Toll ) | nhai | NE- 4 | stat |
| 732 | Beermandi | nhai | 52 | stat |
| 913 | Bhandaraj (Entry Exit )Toll | nhai | NE- 4 | stat |
| 1145 | Chohilanwali TP3 (Close Loop Toll) | nhai | 754K (New 754A) | stat |
| 1099 | Dadal TP 20 (Close Loop Toll) | nhai | 754 A | stat |
| 945 | Dangiyawas | nhai | 125A | stat |
| 178 | Daulatpura Fee Plaza (KOTA) | nhai | 552 | stat |
| 1203 | Daulatpura Toll Plaza (JAI) | nhai | 48 | stat |
| 1146 | Deora TP 21 (Close Loop Toll) | nhai | 754A | stat |
| 944 | Deshnok TP8  (Close Loop Toll) | nhai | 754K (New 754A) | stat |
| 914 | Dungarpur (Entry Exit ) Toll | nhai | NE- 4 | stat |
| 2102 | Jaipur-Bhilwara State Highway Toll Plaza | state |  | stat |
| 940 | Jaitpur TP4 (Jaipur) (Close Loop Toll) | nhai | 754K (New 754A) | stat |
| 938 | Jaswantpura | nhai | 158 | stat |
| 889 | Karel | nhai | 58E | stat |
| 104 | Khandi Obari | nhai | 48 | bari |
| 862 | Lakhasar | nhai | 11 | bari |
| 1260 | Lanela Toll Plaza | nhai | 68 | stat |
| 941 | Malkisar  TP5 (Close Loop Toll) | nhai | 754K (New 754A) | stat |
| 946 | Manaklavo | nhai | 125A | stat |
| 1179 | Mokhupura TP23 (Close Loop Toll) | nhai | 754A | stat |
| 380 | Mujras | nhai | 758 | stat |
| 943 | Norangdesar  TP7 (Close Loop Toll) | nhai | 754K (New 754A) | stat |
| 1163 | Padla Hadliya Plaza | nhai | 927A | stat |
| 1262 | Parewar Toll Plaza | nhai | 968 | stat |
| 1261 | Ramgarh Toll Plaza | nhai | 68 | stat |
| 860 | Rashidpura | nhai | 11 | bari |
| 1144 | Sangariya TP1 (Close Loop Toll) | nhai | 754K (New 754A) | stat |
| 2101 | Sitarampura Toll Plaza | state |  | stat |
| 722 | Thirpali Bari | nhai | 709(E) | bari |
| 861 | Tidiayasar | nhai | 11 | bari |
| 942 | Uchharangdesar  TP6 (Close Loop Toll) | nhai | 754K (New 754A) | stat |

## RJ SH 43 (89 km)

**Corridor (Wikipedia):** Bari (NH 11B to Sonkh up to State Border via Baseri, Bandh Baretha, Kheria Mod, Ucchan, Bharatpur

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 148 | Amoli | nhai | 11 (New 21) | bharatpur |
| 104 | Khandi Obari | nhai | 48 | bari |
| 92 | Korai | nhai | 11 (New 21) | bharatpur |
| 862 | Lakhasar | nhai | 11 | bari |
| 82 | Ludhawai | nhai | 11 (New 21) | bharatpur |
| 860 | Rashidpura | nhai | 11 | bari |
| 722 | Thirpali Bari | nhai | 709(E) | bari |
| 861 | Tidiayasar | nhai | 11 | bari |

## RJ SH 44 (129.2 km)

**Corridor (Wikipedia):** Natani ka Bera to Kaman Koshi Road via Mala Khera, Laxmangarh, Kathoomar, Nadbai, Deeg.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 1145 | Chohilanwali TP3 (Close Loop Toll) | nhai | 754K (New 754A) | mala |
| 603 | Gangajali | nhai | 911  911-A | mala |
| 862 | Lakhasar | nhai | 11 | laxmangarh |
| 522 | Lal Ka Khera | nhai | 148D | khera |
| 860 | Rashidpura | nhai | 11 | laxmangarh |
| 1144 | Sangariya TP1 (Close Loop Toll) | nhai | 754K (New 754A) | mala |
| 861 | Tidiayasar | nhai | 11 | laxmangarh |

## RJ SH 45 (135 km)

**Corridor (Wikipedia):** Ramgarh (SH-13) to Fatehpur Sikri (up to State Border) via Govindgarh, Sikari, Nagar, Nadbai, Weir, Bayana, Rudawal, Bharatpur Alwar

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 148 | Amoli | nhai | 11 (New 21) | bharatpur |
| 783 | Bahala | nhai | 248 A | alwar |
| 383 | Dhadhar | nhai | 52 | fatehpur |
| 12 | Fatehpur | nhai | 27 | fatehpur |
| 92 | Korai | nhai | 11 (New 21) | bharatpur |
| 382 | Lasedi | nhai | 52 | fatehpur |
| 82 | Ludhawai | nhai | 11 (New 21) | bharatpur |
| 1261 | Ramgarh Toll Plaza | nhai | 68 | ramgarh |
| 384 | Shobhasar | nhai | 52 | fatehpur |

## RJ SH 48 (27.6 km)

**Corridor (Wikipedia):** Chhani to Rani

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 391 | Morani (Pokaran) | nhai | 114 | rani |

## RJ SH 49 (115.8 km)

**Corridor (Wikipedia):** Mavli to Charbhujaji (SH-16) via Nathdwara, Kelwara

**Toll plazas (this dataset, heuristic):** *none matched by place-token overlap.* May still have tolls on this corridor — verify with maps / RSRDC / field.

## RJ SH 50 (93 km)

**Corridor (Wikipedia):** Udaipur to Som (SH-10) via Jhadol

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 1213 | Dakan Kotra | nhai | 48 | udaipur |
| 100 | Gogunda (Jaswantgarh) | nhai | 27 | udaipur |
| 889 | Karel | nhai | 58E | jhadol |
| 104 | Khandi Obari | nhai | 48 | udaipur |
| 106 | Malera | nhai | 27 | udaipur |
| 341 | Mandawada (Gomati) | nhai | 58 | udaipur |
| 105 | Narayanpura | nhai | 76 | udaipur |
| 342 | Negadiya | nhai | 58 | udaipur |

## RJ SH 51 (156.3 km)

**Corridor (Wikipedia):** Kota to Dharnawada up to State Border via Ladpura, Sangod, Chhabra.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 10 | Aroli | nhai | 27 | kota |
| 550 | Badighati | nhai | 89 | kota |
| 267 | Bagaliya | nhai | 80 | kota |
| 377 | Banthadi | nhai | 458 | kota |
| 9 | Bassi | nhai | 27 | kota |
| 549 | Butati (Kuchera) | nhai | 89 | kota |
| 178 | Daulatpura Fee Plaza (KOTA) | nhai | 552 | kota |
| 11 | Dhaneshwar | nhai | 27 | kota |
| 12 | Fatehpur | nhai | 27 | kota |
| 309 | Gegal | nhai | 8 | kota |
| 938 | Jaswantpura | nhai | 158 | kota |
| 601 | Khachrol (Hoda) | nhai | 758 | ladpura |
| 756 | Khedi | nhai |  79 , 79A | kota |
| 340 | Kishorpura | nhai | 52 | kota |
| 417 | Kota Bypass (Sakatpura ) | nhai | 27 | kota |
| 355 | Lilamba | nhai | 458 | kota |
| 493 | Mandana (Kota) | nhai | 52 | kota |
| 380 | Mujras | nhai | 758 | kota |
| 1205 | Para Toll Plaza | nhai | 148D | kota |
| 310 | Pipalaz | nhai | 8 | kota |
| 13 | Simliya | nhai | 27 | kota |
| 769 | Tamdoli | nhai | 458 | kota |

## RJ SH 52 (131.5 km)

**Corridor (Wikipedia):** Ajaraka (SB) to Tala via Mundawar, Sodawas, Harsora, Narayanpur, Thanagazi.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 1145 | Chohilanwali TP3 (Close Loop Toll) | nhai | 754K (New 754A) | tala |
| 944 | Deshnok TP8  (Close Loop Toll) | nhai | 754K (New 754A) | tala |
| 426 | Hathitala | nhai | 68 | tala |
| 940 | Jaitpur TP4 (Jaipur) (Close Loop Toll) | nhai | 754K (New 754A) | tala |
| 941 | Malkisar  TP5 (Close Loop Toll) | nhai | 754K (New 754A) | tala |
| 105 | Narayanpura | nhai | 76 | narayanpur |
| 943 | Norangdesar  TP7 (Close Loop Toll) | nhai | 754K (New 754A) | tala |
| 1144 | Sangariya TP1 (Close Loop Toll) | nhai | 754K (New 754A) | tala |
| 942 | Uchharangdesar  TP6 (Close Loop Toll) | nhai | 754K (New 754A) | tala |

## RJ SH 53 (126 km)

**Corridor (Wikipedia):** Bhindar to Rikhabdeo via Bambora, Salumbar, Kalyanpur.

**Toll plazas (this dataset, heuristic):** *none matched by place-token overlap.* May still have tolls on this corridor — verify with maps / RSRDC / field.

## RJ SH 54 (104 km)

**Corridor (Wikipedia):** Aspur to Saruthana via Punjpur, Punali, Dobra, Simalwara, Peeth.

**Toll plazas (this dataset, heuristic):** *none matched by place-token overlap.* May still have tolls on this corridor — verify with maps / RSRDC / field.

## RJ SH 55 (89.6 km)

**Corridor (Wikipedia):** Gudha (SH-52) to Jaipur (NH 8) via Kishori, Sidh ka Tibara, Jhiri, Andhi, Ramgarh.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 1224 | Bagrana  (Close Loop Toll ) | nhai | NE-4C | jaipur |
| 150 | Barkheda (Chandlai) | nhai | 52 | jaipur |
| 1185 | Bedoli (Close Loop Toll ) | nhai | NE-4C | jaipur |
| 1203 | Daulatpura Toll Plaza (JAI) | nhai | 48 | jaipur |
| 1183 | Geela Ki Nangal (Close Loop Toll) | nhai | NE-4C | jaipur |
| 2102 | Jaipur-Bhilwara State Highway Toll Plaza | state |  | jaipur |
| 940 | Jaitpur TP4 (Jaipur) (Close Loop Toll) | nhai | 754K (New 754A) | jaipur |
| 1186 | Khurikhud (Close Loop Toll) | nhai | NE-4C | jaipur |
| 95 | Kishangarh (Badgaon) | nhai | 48 | jaipur |
| 177 | Manoharpur | nhai | 48 | jaipur |
| 147 | Rajadhok | nhai | 11 (New 21) | jaipur |
| 1261 | Ramgarh Toll Plaza | nhai | 68 | ramgarh |
| 176 | Shahjahanpur | nhai | 48 | jaipur |
| 1184 | Shyamsinghpura Virtual (Close Loop Toll) | nhai | NE-4C | jaipur |
| 865 | Sidhpura | nhai | 113 | sidh |
| 146 | Sikandra | nhai | 11 (New 21) | jaipur |
| 2101 | Sitarampura Toll Plaza | state |  | jaipur |
| 151 | Sonwa (Sonva) | nhai | 52 | jaipur |
| 1182 | Sundarpura (Close Loop Toll) | nhai | NE-4C | jaipur |
| 97 | Tatiyawas | nhai | 52 | jaipur |
| 149 | Thikariya (Jaipur) | nhai | 48 | jaipur |

## RJ SH 56 (83 km)

**Corridor (Wikipedia):** Mandri (SH-12) to Lassani Tal up to NH 8 via Amet, Devgarh.

**Toll plazas (this dataset, heuristic):** *none matched by place-token overlap.* May still have tolls on this corridor — verify with maps / RSRDC / field.

## RJ SH 57 (26 km)

**Corridor (Wikipedia):** Mokhampura (NH 8) to Sambhar via Phulera

**Toll plazas (this dataset, heuristic):** *none matched by place-token overlap.* May still have tolls on this corridor — verify with maps / RSRDC / field.

## RJ SH 58 (181 km)

**Corridor (Wikipedia):** Jodhpur to Bheem up to NH 58 via Vinaika, Mandor, Jodhpur, Sardar samand, Jadan, Sojat Road, Kantalia, Jhinjharadi, Bhabhan, Badakheda, Bheem(Rajsamand).

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 717 | Binawas | nhai | 25 | jodhpur |
| 718 | Biratiya Kalan | nhai | 25 | jodhpur |
| 945 | Dangiyawas | nhai | 125A | jodhpur |
| 378 | Doli | nhai | 112 | jodhpur |
| 1198 | Gajangarh Toll Plaza | nhai | 65 (New 62) | jodhpur |
| 389 | Jasnathnagar | nhai | 114 | jodhpur |
| 1051 | Laxamannagar TP 11  (Close Loop Toll) | nhai | 754A | jodhpur |
| 946 | Manaklavo | nhai | 125A | jodhpur |
| 391 | Morani (Pokaran) | nhai | 114 | jodhpur |
| 390 | Motisar (Khanori) | nhai | 114 | jodhpur |
| 682 | Netra | nhai | 62 | mandor |
| 856 | Nimbali | nhai | 62 | jodhpur |
| 1205 | Para Toll Plaza | nhai | 148D | bheem |
| 379 | Rupakheda | nhai | 758 | samand |
| 986 | Sirmandi TP 13(Close Loop Toll) | nhai | 754A | jodhpur |
| 681 | Tankla | nhai | 62 | mandor |
| 863 | Udairamsar | nhai | 11 (New 89) | jodhpur |

## RJ SH 59 (159.9 km)

**Corridor (Wikipedia):** Beawar to Neemla Jodha via Pisangan, Govindgarh, Ladpura, Tehla, Bherunda, Harsore, Degana, Khatu, Bhantri.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 1025 | Baggad | nhai | 8 | beawar |
| 377 | Banthadi | nhai | 458 | jodha |
| 323 | Birami | nhai | 62 | beawar |
| 309 | Gegal | nhai | 8 | beawar |
| 322 | Indranagar | nhai | 162 | beawar |
| 938 | Jaswantpura | nhai | 158 | beawar |
| 601 | Khachrol (Hoda) | nhai | 758 | ladpura |
| 429 | Nimbi Jodha | nhai | 58 | jodha |
| 310 | Pipalaz | nhai | 8 | beawar |
| 1160 | Pipalwas Plaza | nhai | 58E | beawar |
| 321 | Raipur | nhai | 62 | beawar |
| 769 | Tamdoli | nhai | 458 | jodha |
| 324 | Uthamam | nhai | 14 | beawar |

## RJ SH 60 (181 km)

**Corridor (Wikipedia):** Thanwala to Ganeri (SH-20) via Bherunda, Neemari, Kothariya, Degana, Sanjhun, Tarneu, Jayal, Didwana.

**Toll plazas (this dataset, heuristic):** *none matched by place-token overlap.* May still have tolls on this corridor — verify with maps / RSRDC / field.

## RJ SH 61 (349 km)

**Corridor (Wikipedia):** Phalodi (NH 15) to Mandal via Osian, Mathania, Jodhpur, Khejrali, Bhatenda, Saradasamand, Jadan, Marwar Junction, Auwa, Jojawar, Kamalighat, Devgarh, Rajaji ka kareda.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 717 | Binawas | nhai | 25 | jodhpur |
| 718 | Biratiya Kalan | nhai | 25 | jodhpur |
| 945 | Dangiyawas | nhai | 125A | jodhpur |
| 378 | Doli | nhai | 112 | jodhpur |
| 1198 | Gajangarh Toll Plaza | nhai | 65 (New 62) | jodhpur |
| 389 | Jasnathnagar | nhai | 114 | jodhpur |
| 781 | Kheerwa | nhai | 15(New 11) | phalodi |
| 445 | Lathi | nhai | 15
(New 11) | phalodi |
| 1051 | Laxamannagar TP 11  (Close Loop Toll) | nhai | 754A | jodhpur |
| 946 | Manaklavo | nhai | 125A | jodhpur |
| 391 | Morani (Pokaran) | nhai | 114 | jodhpur |
| 390 | Motisar (Khanori) | nhai | 114 | jodhpur |
| 856 | Nimbali | nhai | 62 | jodhpur |
| 449 | Nokhra | nhai | 15(New 11) | phalodi |
| 444 | Ramdevra | nhai | 15(New 11) | phalodi |
| 448 | Salasar | nhai | 15(New 11) | phalodi |
| 986 | Sirmandi TP 13(Close Loop Toll) | nhai | 754A | jodhpur |
| 863 | Udairamsar | nhai | 11 (New 89) | jodhpur |

## RJ SH 62 (187 km)

**Corridor (Wikipedia):** Bilara to Pindwara via Sojat, Sireeyari, Jojawar, Bagol, Desuri, Sadri, Sewari.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 717 | Binawas | nhai | 25 | bilara |
| 323 | Birami | nhai | 62 | pindwara |
| 718 | Biratiya Kalan | nhai | 25 | bilara |
| 100 | Gogunda (Jaswantgarh) | nhai | 27 | pindwara |
| 322 | Indranagar | nhai | 162 | pindwara |
| 106 | Malera | nhai | 27 | pindwara |
| 321 | Raipur | nhai | 62 | pindwara |
| 324 | Uthamam | nhai | 14 | pindwara |

## RJ SH 63 (129 km)

**Corridor (Wikipedia):** Banar to Kuchera via Bhopalgarh Asop.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 549 | Butati (Kuchera) | nhai | 89 | kuchera |

## RJ SH 64 (82 km)

**Corridor (Wikipedia):** Rohat (NH 65) to Ahore (SH-16) via Vasi, Bhadrajun.

**Toll plazas (this dataset, heuristic):** *none matched by place-token overlap.* May still have tolls on this corridor — verify with maps / RSRDC / field.

## RJ SH 65 (154.5 km)

**Corridor (Wikipedia):** Sheo (NH 15) to Shergarh via Bhiyad, Barnawa Jagger, Patodi, Phalsoond.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 178 | Daulatpura Fee Plaza (KOTA) | nhai | 552 | sheo |

## RJ SH 66 (90 km)

**Corridor (Wikipedia):** Siwana to Dhandhaniya (NH 114) via Samdari, Kalyanpur, Mandli Rodhawa Kalan.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 718 | Biratiya Kalan | nhai | 25 | kalan |
| 152 | Lambia Kalan | nhai | 79 | kalan |

## RJ SH 67 (87 km)

**Corridor (Wikipedia):** Sardar Samand (SH-61) to Desuri (SH-62) via Pali, Ramsiya, Somesar,

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 323 | Birami | nhai | 62 | pali |
| 1198 | Gajangarh Toll Plaza | nhai | 65 (New 62) | pali |
| 322 | Indranagar | nhai | 162 | pali |
| 321 | Raipur | nhai | 62 | pali |
| 379 | Rupakheda | nhai | 758 | samand |
| 722 | Thirpali Bari | nhai | 709(E) | pali |
| 324 | Uthamam | nhai | 14 | pali |

## RJ SH 68 (131 km)

**Corridor (Wikipedia):** Dangiyawas (NH 112) to Balotra via Kakelao, Khejarli, Guda Kakani, Luni, Dhundhara, Rampura, Samdari.

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 716 | Balana | nhai | 325 | balotra |
| 945 | Dangiyawas | nhai | 125A | dangiyawas |
| 547 | Sitarampura | nhai | 148 | rampura |
| 2101 | Sitarampura Toll Plaza | state |  | rampura |

## RJ SH 69 (35 km)

**Corridor (Wikipedia):** Churu Bhaleri

**Toll plazas (this dataset, heuristic):** *none matched by place-token overlap.* May still have tolls on this corridor — verify with maps / RSRDC / field.

## RJ SH 117 (102 km)

**Corridor (Wikipedia):** Diggi to Jastana

**Toll plazas (this dataset, heuristic):** *none matched by place-token overlap.* May still have tolls on this corridor — verify with maps / RSRDC / field.

## RJ SH 122 (158 km)

**Corridor (Wikipedia):** Baroni ([[National Highway 52 (India) to Kurgaon ([[National Highway 23 (India)

**Toll plazas (this dataset, heuristic):** *none matched by place-token overlap.* May still have tolls on this corridor — verify with maps / RSRDC / field.

## RJ SH 123 (102 km)

**Corridor (Wikipedia):** Bhahrowanda to Jagner, Utter Pradash

**Toll plazas (this dataset, heuristic):** *none matched by place-token overlap.* May still have tolls on this corridor — verify with maps / RSRDC / field.

## RJ SH 138 ( km)

**Corridor (Wikipedia):** [[#SH0029 to [[National Highway 148D (India)

**Toll plazas (heuristic matches — verify):**

| ID | Name | Source | NH | Token overlap |
|----|------|--------|-----|----------------|
| 521 | Kadisahena | nhai | 148D | 148d |
| 522 | Lal Ka Khera | nhai | 148D | 148d |
| 523 | Pallai | nhai | 148D | 148d |
| 1205 | Para Toll Plaza | nhai | 148D | 148d |

## What to do next

1. **Treat this as a triage list, not ground truth.** Many NHAI plazas sit near or straddle state-corridor towns; token overlap can still be wrong. Use Google Maps / OSM / RSRDC / news to confirm before tagging a plaza as "on RJ SH *x*".

2. **Curate RSRDC-only plazas** (true state-highway tolls) in `data/sources/state_highways.json` with `location` citing the RJ SH where verified (e.g. "along RJ SH 12 near Phagi").

3. **Optionally add a field** in a future schema version, e.g. `state_highway_routes: ["12"]`, only after manual verification — do not infer from this heuristic alone.

4. **Re-run** after data updates: `node scripts/buildRajasthanShTollMap.js` (refetches Wikipedia, re-reads `data/latest.json`).

