# Project Overview
  
 - For my project, I decided to make an API using the cards in Hearthstone. Hearthstone is a virtual card developed by Blizzard Games. Along with Magic The Gathering, it is probably one of the most popular card games out right now. 
 
 - In the game, there a ton of cards, each with their own name and stats. Each card also has a "rarity", or how frequent the cards come out of the in-game card packs. These rarities include: Common, Rare, Epic, and Legendary. Common being the most frequent, and Legendary being the least frequent. 
 
 - There are also tons of statistics that people collect on each card like Winrates, the percentage in decks and how many times they have been played. In this project, I took a small amount of cards, and some of the stats found on [HSReplay](https://hsreplay.net/). 
 
 - Using these cards I chose, I made an API that users can look at the cards in my database and put together their own decks with 30 cards, and name them. 
 
 ### Data Types in My Database
 - Users: id, username, first name, last name, email, password
 - Cards: id, name, rarity, deck winrate, played winrate
 - Decks: id, id of author, name, array of 30 unique cards
 
 ### ERD
 
 ![ERD](https://i.imgur.com/LJ84Li5.png)
 
 
