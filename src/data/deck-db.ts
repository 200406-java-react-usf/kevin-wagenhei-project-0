import {Deck} from '../models/decks';
import {Card} from '../models/cards';

let id: number = 1;

let deckOneArray: Card[] = [

    new Card(1, 'Escrivate', 'Common', 12.3, 1.4, 57.1, 100000, 54),
    new Card(15, 'Eaglehorn Bow', 'Rare', 5.1, 1.9, 57.2, 39000, 53.6),
    new Card(18, 'Shadow Madness', 'Rare', 3.8, 1.2, 53.4, 30000, 52),
    new Card(22, 'Mass Dispell', 'Rare', 3.5, 1.2, 50.5, 28000, 50.4),
    new Card(23, 'Loot Hoarder', 'Common', 2.4, 1.8, 46.5, 26000, 42.4),
    new Card(12, 'Power of the Wild', 'Common', 3.7, 1.9, 53.5, 47000, 55.6),
    new Card(24, 'Far Sight', 'Epic', 2.1, 1.5, 51.5, 24000, 46.3),
    new Card(16, 'Doomsayer', 'Epic', 6.5, 1, 55.3, 36000, 45.6),
    new Card(25, 'Brightwing', 'Legendary', 1.3, 1, 48.5, 24000, 50.2),
    new Card(7, 'Edwin Vancleef', 'Legendary', 11.6, 1, 57.9, 63000, 60.8),
    new Card(29, 'Murloc Warleader', 'Epic', 2.9, 2, 58.2, 23000, 56.1),
    new Card(13, 'Leper Gnome', 'Common', 4.5, 1.9, 57.8, 41000, 52.8),
    new Card(26, 'Coldlight Seer', 'Rare', 3, 2, 58, 23000, 53.6),
    new Card(11, 'Alexstraza', 'Legendary', 13.2, 1, 54.4, 49000, 62.6),
    new Card(2, 'Ice Barriar', 'Common', 9.7, 1.2, 54, 95000, 49),
    new Card(1, 'Escrivate', 'Common', 12.3, 1.4, 57.1, 100000, 54),
    new Card(15, 'Eaglehorn Bow', 'Rare', 5.1, 1.9, 57.2, 39000, 53.6),
    new Card(18, 'Shadow Madness', 'Rare', 3.8, 1.2, 53.4, 30000, 52),
    new Card(22, 'Mass Dispell', 'Rare', 3.5, 1.2, 50.5, 28000, 50.4),
    new Card(23, 'Loot Hoarder', 'Common', 2.4, 1.8, 46.5, 26000, 42.4),
    new Card(12, 'Power of the Wild', 'Common', 3.7, 1.9, 53.5, 47000, 55.6),
    new Card(24, 'Far Sight', 'Epic', 2.1, 1.5, 51.5, 24000, 46.3),
    new Card(16, 'Doomsayer', 'Epic', 6.5, 1, 55.3, 36000, 45.6),
    new Card(25, 'Brightwing', 'Legendary', 1.3, 1, 48.5, 24000, 50.2),
    new Card(7, 'Edwin Vancleef', 'Legendary', 11.6, 1, 57.9, 63000, 60.8),
    new Card(29, 'Murloc Warleader', 'Epic', 2.9, 2, 58.2, 23000, 56.1),
    new Card(13, 'Leper Gnome', 'Common', 4.5, 1.9, 57.8, 41000, 52.8),
    new Card(26, 'Coldlight Seer', 'Rare', 3, 2, 58, 23000, 53.6),
    new Card(11, 'Alexstraza', 'Legendary', 13.2, 1, 54.4, 49000, 62.6),
    new Card(2, 'Ice Barriar', 'Common', 9.7, 1.2, 54, 95000, 49)

];

let deckTwoArray: Card[] = [

    new Card(1, 'Escrivate', 'Common', 12.3, 1.4, 57.1, 100000, 54),
    new Card(15, 'Eaglehorn Bow', 'Rare', 5.1, 1.9, 57.2, 39000, 53.6),
    new Card(18, 'Shadow Madness', 'Rare', 3.8, 1.2, 53.4, 30000, 52),
    new Card(22, 'Mass Dispell', 'Rare', 3.5, 1.2, 50.5, 28000, 50.4),
    new Card(23, 'Loot Hoarder', 'Common', 2.4, 1.8, 46.5, 26000, 42.4),
    new Card(12, 'Power of the Wild', 'Common', 3.7, 1.9, 53.5, 47000, 55.6),
    new Card(24, 'Far Sight', 'Epic', 2.1, 1.5, 51.5, 24000, 46.3),
    new Card(16, 'Doomsayer', 'Epic', 6.5, 1, 55.3, 36000, 45.6),
    new Card(25, 'Brightwing', 'Legendary', 1.3, 1, 48.5, 24000, 50.2),
    new Card(7, 'Edwin Vancleef', 'Legendary', 11.6, 1, 57.9, 63000, 60.8),
    new Card(29, 'Murloc Warleader', 'Epic', 2.9, 2, 58.2, 23000, 56.1),
    new Card(13, 'Leper Gnome', 'Common', 4.5, 1.9, 57.8, 41000, 52.8),
    new Card(26, 'Coldlight Seer', 'Rare', 3, 2, 58, 23000, 53.6),
    new Card(11, 'Alexstraza', 'Legendary', 13.2, 1, 54.4, 49000, 62.6),
    new Card(2, 'Ice Barriar', 'Common', 9.7, 1.2, 54, 95000, 49),
    new Card(1, 'Escrivate', 'Common', 12.3, 1.4, 57.1, 100000, 54),
    new Card(15, 'Eaglehorn Bow', 'Rare', 5.1, 1.9, 57.2, 39000, 53.6),
    new Card(18, 'Shadow Madness', 'Rare', 3.8, 1.2, 53.4, 30000, 52),
    new Card(22, 'Mass Dispell', 'Rare', 3.5, 1.2, 50.5, 28000, 50.4),
    new Card(23, 'Loot Hoarder', 'Common', 2.4, 1.8, 46.5, 26000, 42.4),
    new Card(12, 'Power of the Wild', 'Common', 3.7, 1.9, 53.5, 47000, 55.6),
    new Card(24, 'Far Sight', 'Epic', 2.1, 1.5, 51.5, 24000, 46.3),
    new Card(16, 'Doomsayer', 'Epic', 6.5, 1, 55.3, 36000, 45.6),
    new Card(25, 'Brightwing', 'Legendary', 1.3, 1, 48.5, 24000, 50.2),
    new Card(7, 'Edwin Vancleef', 'Legendary', 11.6, 1, 57.9, 63000, 60.8),
    new Card(29, 'Murloc Warleader', 'Epic', 2.9, 2, 58.2, 23000, 56.1),
    new Card(13, 'Leper Gnome', 'Common', 4.5, 1.9, 57.8, 41000, 52.8),
    new Card(26, 'Coldlight Seer', 'Rare', 3, 2, 58, 23000, 53.6),
    new Card(11, 'Alexstraza', 'Legendary', 13.2, 1, 54.4, 49000, 62.6),
    new Card(2, 'Ice Barriar', 'Common', 9.7, 1.2, 54, 95000, 49)

];

export default [

    new Deck(id++, 1, 'Kevin\'s Deck', deckOneArray),
    new Deck(id++, 3, 'Nick\'s Deck', deckTwoArray)

];