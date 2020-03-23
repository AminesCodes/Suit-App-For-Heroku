/*
Database | SUITAPP Web App
GROUP 1: Amine Bensalem, Douglas MacKrell, Savita Madray, Joseph P. Pasaoa
*/

/* CREATE DATABASE */
-- DROP DATABASE IF EXISTS suitapp_db;
-- CREATE DATABASE suitapp_db;
\c suitapp_db;

DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS reactions;
DROP TABLE IF EXISTS follows;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;

/* CREATE TABLES */
CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR (20) NOT NULL,
    lastname VARCHAR (20) NOT NULL,
    username VARCHAR (20),
    normalized_username VARCHAR (20) UNIQUE NOT NULL,
    user_password VARCHAR NOT NULL,
    email VARCHAR (30) UNIQUE NOT NULL,
    avatar_url TEXT DEFAULT '',
    bio VARCHAR (500) DEFAULT '',
    light_theme BOOLEAN NOT NULL DEFAULT TRUE,
    time_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts
(
    id SERIAL PRIMARY KEY,
    title VARCHAR (36) DEFAULT '',
    image_url TEXT NOT NULL,
    caption VARCHAR DEFAULT '',
    owner_id INT REFERENCES users(id) ON DELETE CASCADE,
    hashtag_str TEXT DEFAULT '',
    time_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments
(
    id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts(id) ON DELETE CASCADE,
    commenter_id INT REFERENCES users(id) ON DELETE CASCADE,
    comment_body VARCHAR NOT NULL,
    time_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE reactions
(
    id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts(id) ON DELETE CASCADE,
    comment_id INT REFERENCES comments(id) ON DELETE CASCADE,
    reactor_id INT REFERENCES users(id) ON DELETE CASCADE,
    emoji_type INT NOT NULL,
    time_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE follows
(
    id SERIAL PRIMARY KEY,
    follower_id INT REFERENCES users(id) ON DELETE CASCADE,
    followed_user_id INT REFERENCES users(id) ON DELETE CASCADE,
    time_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE events
(
    id SERIAL PRIMARY KEY,
    start_time DATE NOT NULL,
    end_time DATE NOT NULL,
    con_name VARCHAR (100) NOT NULL,
    con_state VARCHAR (100) NOT NULL,
    con_location VARCHAR (100) NOT NULL,
    con_url VARCHAR (200) DEFAULT '',
    time_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP 
);


/* SEED DATA */

INSERT INTO users
(firstname, lastname, username, normalized_username, user_password, email, avatar_url, bio)
VALUES
('Abby', 'Star', 'Abby Dark Star', 'abbydarkstar', '$2b$12$m3dV7Sn8pSjvdb8kKHXih.dmkGSLfz2PqsC99ntOkG9MWPXB8pSuC', 'abbydarkstar@gmail.com', '/images/avatars/abby_avatar.jpg', 'New England bred, Southern raised, West Coast girl. Marketing| Content Creator | Cosplayer| Current: Unity |Former: Logitech G, Ubisoft'),
('Nova', 'Kyra', 'Nova Kyra', 'novakyra', '$2b$12$m3dV7Sn8pSjvdb8kKHXih.dmkGSLfz2PqsC99ntOkG9MWPXB8pSuC', 'novakyra@gmail.com', '/images/avatars/nova_avatar.jpg', '20 something lover of cosplay, wine, bikinis and general nerdity.'),
('Envy', 'Us', 'EnvyUs', 'envyus', '$2b$12$m3dV7Sn8pSjvdb8kKHXih.dmkGSLfz2PqsC99ntOkG9MWPXB8pSuC', 'greenwith@gmail.com', '/images/avatars/envy_avatar.jpg', 'Just a girl Lovecrafting their way to your heart'),
('Spider', 'Monarch', 'Cursed Arachnid', 'cursedarachnid', '$2b$12$m3dV7Sn8pSjvdb8kKHXih.dmkGSLfz2PqsC99ntOkG9MWPXB8pSuC', 'cursedarachnid@gmail.com', '/images/avatars/cursed_avatar.jpg', '🕷spiders are beautiful🕷spider-man/fantastic four enthusiast🕷'),
('MH', 'Cosplay & Design', 'MH Cosplay & Design', 'mhcosplaydesign', '$2b$12$m3dV7Sn8pSjvdb8kKHXih.dmkGSLfz2PqsC99ntOkG9MWPXB8pSuC', 'mhcosplay@gmail.com', '/images/avatars/mh_avatar.jpg', 'Professional Cosplayer who loves Cosplay Art, and I love to create anything art related. Enjoy scrolling through my cosplay page.'),
('MegaSeneca', 'Cosplay', 'MegaSeneca Cosplay', 'megasenecacosplay', '$2b$12$m3dV7Sn8pSjvdb8kKHXih.dmkGSLfz2PqsC99ntOkG9MWPXB8pSuC', 'megaseneca@gmail.com', '/images/avatars/megaseneca_avatar.jpg', 'amateur cosplayer, artist, avid Megaman fan'),
('Chris', 'Mason', 'Chris Mason', 'chrismason', '$2b$12$m3dV7Sn8pSjvdb8kKHXih.dmkGSLfz2PqsC99ntOkG9MWPXB8pSuC', 'fit4life.com', '/images/avatars/chris_avatar.jpg', 'Gym Addict, Mixed martial artist, Cosplayer and Traveller. My Cosplay page is King of The North Cosplays'),
('Dan', 'Morash', 'DanMorashCosplay', 'danmorashcosplay', '$2b$12$m3dV7Sn8pSjvdb8kKHXih.dmkGSLfz2PqsC99ntOkG9MWPXB8pSuC', 'dantheman@gmail.com', '/images/avatars/leonardo_avatar.jpg', 'Cosplayer from Halifax - Obsessed with my cat and Funkos.'),
('Empty', 'Newbie', 'mrNewPerson', 'mrnewperson', '$2b$12$m3dV7Sn8pSjvdb8kKHXih.dmkGSLfz2PqsC99ntOkG9MWPXB8pSuC', 'mrempty@gmail.com', '', '');

INSERT INTO posts
(title, image_url, caption, owner_id, hashtag_str, time_created)
VALUES
('Happy New Year!', '/images/posts/abby1.jpeg', '#HappyNewYear everyone! I hope it is filled with joy, love and experiences that fulfill you. No matter the difficulty the new year brings, you can get through it. I look forward to sharing new adventures with you!', 1, '#HappyNewYear#', '2019-05-28 03:26:14.402303-05'),
('So White', '/images/posts/abby2.jpeg', 'My #Winter White Girl #cosplay is complete.', 1, '#Winter#cosplay#', '2019-05-28 14:37:23.402303-05'),
('It''s Doctor "Whom"', '/images/posts/abby3.jpeg', 'The #Tardis broke a things-whirly so I’m trying this human transport! Allonsy!', 1, '#Tardis#', '2019-05-28 07:00:00.402303-05'),
('COME FIND ME!', '/images/posts/abby4.jpeg', 'Headed to the #Marriott floor! #cosplay2020 #dragoncon #strangerthings', 1, '#Marriott#cosplay2020#dragoncon#strangerthings#', '2019-05-28 08:10:35.402303-05'),
('Caught In My Web', '/images/posts/nova1.jpeg','“Your life stopped being your own the moment you were bit by that spider.” #cindymoon #silk #spiderverse #cosplay', 2, '#cindymoon#silk#spiderverse#cosplay#', '2019-05-28 16:44:21.402303-05'),
('Feelings', '/images/posts/nova2.jpeg', 'Look. I’m not all that attractive outside of all the cosplay makeup. I am a hermit with greasy hair, acne, half of my face is sunken in, one eye is bigger than the other, my eyes are different shapes, shit I’m even missing half my teeth. But I love #hotwings. So I win.', 2, '#hotwings#', '2019-05-28 09:13:06.402303-05'),
('Out On The Floor!', '/images/posts/nova3.jpeg', 'Out on the #Marriott floor come say hi!', 2, '#Marriott#', '2019-05-28 01:52:55.402303-05'),
('One Of My Faves.', '/images/posts/nova4.jpeg', '“Come on live a little, while you can.” This is from #2014 but it’s still one of my favorite #cosplay photos!', 2, '#2014#cosplay#', '2019-05-28 13:13:13.402303-05'),
('It''s Getting Better', '/images/posts/envy1.jpeg', '#2009 I wasn’t sure if I would make it through the night, to now pursuing my #dreams and having a wonderful career with amazing friends all over the world.Thank you for being a part of it, and never give up on yourself. You might surprise yourself with just how much you can do 💛 #Ghostbusters #Gozer', 3, '#2009#dreams#Ghostbusters#Gozer#', '2019-05-28 17:32:41.402303-05'),
('Year In Review', '/images/posts/envy2.jpeg', 'I experienced so much, more than I ever thought I would be able to. I learned a lot about myself and about others. 3 years ago I quit my job as a lab tech and made the leap into doing #patreon and content creation full time on the other side of the country almost 3,000 miles away.', 3, '#patreon#', '2019-05-28 21:19:05.402303-05'),
('I Choose You!', '/images/posts/envy3.jpeg', 'Hey, you looking  for a Personal Assistant? 🧡 #Sonia #Pokemon #Pikachu #DetectivePikachu', 3, '#Sonia#Pokemon#Pikachu#DetectivePikachu#', '2019-05-28 13:31:13.402303-05'),
('Bustin'' Makes Me Feel Good', '/images/posts/envy4.jpeg', 'I''m looking for the Key Master. #Ghostbusters #Dana #Zuul #DanaZuul', 3, '#Ghostbusters#Dana#Zuul#DanaZuul#', '2019-05-28 20:42:06.402303-05'),
('Welcome To My Parlor', '/images/posts/cursed1.jpeg', 'Welcome, my dear #spiderlings! I''m a #horror #cosplayer / #streamer with a #spider obsession, here to cause a spook.', 4, '#spiderlings#horror#cosplayer#streamer#spider#', '2019-05-28 10:18:43.402303-05'),
('More To The Point', '/images/posts/cursed2.jpeg', '#HappyNewYear ''s Eve to all! Hope your #Holidays were enjoyable- mine sure were terrific... 🔪 #HappyNewYear', 4, '#NewYearsEve#Holidays#HappyNewYear#', '2019-05-28 05:13:27.402303-05'),
('It Always Sneaks Up On You', '/images/posts/cursed3.jpeg', 'It''s #Friday the 13th, so how about getting #lucky?', 4, '#Friday#lucky#', '2019-05-28 17:19:06.402303-05'),
('', '/images/posts/cursed4.jpeg', '', 4, '', '2019-05-28 23:07:10.402303-05'),
('Felt Cute Might Delete Later', '/images/posts/mh1.jpeg', 'Just pure fierceness #Renekton #fire #scorchedearthrenekton #8ft #supercon #floridasupercon #LeagueOfLegends #LeagueOfLegendsCosplay #Supercon2019', 5, '#Renekton#fire#scorchedearthrenekton#8ft#supercon#floridasupercon#LeagueOfLegends#LeagueOfLegendsCosplay#Supercon2019#', '2019-05-28 19:02:18.402303-05'),
('My Students Are The Best!', '/images/posts/mh2.jpeg', 'I’m proud of my students this year. We have Kha’Zix as well as Ziggs. On the right we have another one of my students as Cassie Cage from MK. #Supercon2019 #MortalKombat #cassiecage #ziggs #khazix #renekton #cosplay #leagueoflegendscosplay', 5, '#Supercon2019#MortalKombat#cassiecage#ziggs#khazix#renekton#cosplay#leagueoflegendscosplay#', '2019-05-28 04:44:44.402303-05'),
('Suiting Up BTS', '/images/posts/mh3.jpeg', 'Getting suited up for Supercon. How’s he looking? #renekton #supercon #supercon2019 #leagueoflegends #floridasupercon #greatness #riotgames #leagueoflegendscosplay', 5, '#renekton#supercon#supercon2019#leagueoflegends#floridasupercon#greatness#riotgames#leagueoflegendscosplay#', '2019-05-28 12:42:06.402303-05'),
('Showroom Ready!', '/images/posts/mh4.jpeg', 'Renekton is ready for Supercon #renekton #riotgame #supercon2019 #floridasupercon #leagueoflegends #supercon #awesome', 5, '#riotgame#supercon2019#floridasupercon#leagueoflegends#supercon#awesome#', '2019-05-28 08:09:00.402303-05'),
('WIP', '/images/posts/megaseneca1.jpeg', 'I made two more weapons for my Mega Man Volnutt cosplay. His shining laser and an unused canon concept from the game. Photos by Tricia McEvoy, my sister and davjwx #megaman #megamancosplay #cosplay #rhodeislandcomiccon #rockman #cosplay #capcom #megamanlegends', 6, '#megaman#megamancosplay#cosplay#rhodeislandcomiccon#rockman#cosplay#capcom#megamanlegends#', '2019-05-28 11:16:10.402303-05'),
('MEGAMAN RED', '/images/posts/megaseneca2.jpeg', 'R E D #megamancosplay #megaman #rockman #cosplay #capcom', 6, '#megamancosplay#megaman#rockman#cosplay#capcom#', '2019-05-28 21:09:15.402303-05'),
('I CAN''T BELIEVE I WON!!!!!', '/images/posts/megaseneca3.jpeg', 'I won the intermediate category at the cosplay competition at Rhode Island Comic Con. The first cosplay competition I won. I want to thank the Mega Man fans on Twitter for supporting me with my cosplay builds. Photos by: Tricia McEvoy #megaman #megmancosplay #cosplay #rockman', 6, '#megaman#megmancosplay#cosplay#rockman#', '2019-05-28 09:00:52.402303-05'),
('These Boots Were Made For Walking', '/images/posts/megaseneca4.jpeg', 'got some new boots today. Out here on dat grind 🙏🏻👏💧keep it 💯 #megaman #megamancosplay #rockman #cosplay #wip', 6, '#megaman#megamancosplay#rockman#cosplay#wip#', '2019-05-28 02:31:05.402303-05'),
('Nightwing', '/images/posts/chris1.jpeg', 'Due to shoot more Nightwing soon. Considering treating the body suit as found a new pattern that will look awesome with the mods #cosplay #wip #workinprogress #fitspo #bodybuildingmotivation #bodysuit #dccomics #dickgrayson #nightwing #robin #batman #KingoftheNorthCosplays', 7, '#cosplay#wip#workinprogress#fitspo#bodybuildingmotivation#bodysuit#dccomics#dickgrayson#nightwing#robin#batman#KingoftheNorthCosplays#', '2019-05-28 13:01:14.402303-05'),
('Spartacus', '/images/posts/chris2.jpeg', '"I know what I''m capable of; I am a soldier now, a warrior. I am someone to fear, not hunt" Ph AJ Charlton Photography || Some #Sunday #Morning #motivation for myself,  get the #gym get back and then beyond my #Spartacus #physique #blackandwhite #photography #fitnessmotivation', 7, '#Sunday#morning#motivation#gym#Spartacus#physique#blackandwhite#photography#fitnessmotivation#', '2019-05-28 06:03:11.402303-05'),
('Making Progress', '/images/posts/chris3.jpeg', 'First progress picture of 2020 and Christmas doesn''t actually seem to have done that much damage!  Time for a new routine and to make some new progress #gym #gymlife #bodyconfidence #bodyweighttraining #bodybuilding #fitness #fitnessmotivation #arms #fitfam #muscleandhealth', 7, '#gym#gymlife#bodyconfidence#bodyweighttraining#bodybuilding#fitness#fitnessmotivation#arms#fitfam#muscleandhealth#', '2019-05-28 20:03:03.402303-05'),
('I Can Go The Distance', '/images/posts/chris4.jpeg', 'Zero to Hero! Photography by the super talented Eric Carroll, Bracers by Cosmic Workshop! #Cosplay #disney #hercules #disneyshercules #gothedistance #zerotohero #disneycosplay #legday #quadsquad #muscles #modelling #cosplayarmour #fitness #fitfam #cosplayersthatlift', 7, '#Cosplay#disney#hercules#disneyshercules#gothedistance#zerotohero#disneycosplay#legday#quadsquad#muscles#modelling#cosplayarmour#fitness#fitfam#cosplayersthatlift#', '2019-05-28 22:08:35.402303-05'),
('HTTYD', '/images/posts/dan1.jpeg', '“I wouldn''t kill him because he looked as frightened as I was. I looked at him, and I saw myself.” #howtotrainyourdragon #cosplay #holmat2019 #HolidayMatsuri', 8, '#howtotrainyourdragon#cosplay#holmat2019#HolidayMatsuri#', '2019-05-28 14:19:31.402303-05'),
('Bloodhaven', '/images/posts/dan2.jpeg', 'I want to make another Nightwing cosplay soon. Maybe my own design inspired by others that have shown up in the comics/shows/games. What are some of your favourite Nightwing/Dick Grayson looks? 📸: Bri Lan Imagery #nightwing #cosplay #dccomics', 8, '#nightwing#cosplay#dccomics#', '2019-05-28 07:10:06.402303-05'),
('Hiccup', '/images/posts/dan3.jpeg', 'The first of many shots showing my new cosplay of Hiccup from How To Train Your Dragon! 📸: #MrPaulTran #HowToTrainYourDragon #cosplay #holmat2019 #HolidayMatsuri #toothless', 8, '#MrPaulTran#HowToTrainYourDragon#cosplay#holmat2019#HolidayMatsuri#toothless#', '2019-05-28 16:14:15.402303-05'),
('Cyclops', '/images/posts/dan4.jpeg', 'Happy #Friday from your favourite eye beam boy ❤️ #xmen #cosplay #marvel', 8, '#Friday#xmen#cosplay#marvel#', '2019-05-28 10:48:59.402303-05'),
('', '/images/posts/dan5.jpeg', '', 8, '', '2019-05-28 01:00:37.402303-05');

INSERT INTO comments
(post_id, commenter_id, comment_body, time_created)
VALUES
(1, 3, 'From this day on I shall be known as Bob. For Bob is a good name and I am good. But if you want you can just call me Sally.', '2019-05-29 10:26:14.402303-05'),
(1, 2, 'I see you have something to talk about. Well, I have something to shout about. Infact something to sing about. But I''ll just keep quiet and let you carry on.', '2019-05-29 03:15:14.402303-05'),
(1, 6, 'And everything is going to the beat And everything is going to the beat And everything is going.', '2019-05-29 03:26:14.402303-05'),
(2, 2, 'Oppan Gangnam Style Gangnam Style Op op op op oppan Gangnam Style Gangnam Style Op op op op oppan Gangnam Style.', '2019-05-29 21:21:14.402303-05'),
(2, 7, 'I see trees of green........ red roses too I see em bloom..... for me and for you And I think to myself.... what a wonderful world.', '2019-05-29 07:23:14.402303-05'),
(2, 4, 'People always told me be careful of what you do And dont go around breaking young girls'' hearts And mother always told me be careful of who you love And be careful of what you do cause the lie becomes the truth.', '2019-05-29 05:06:14.402303-05'),
(3, 3, 'And everything is going to the beat And everything is going to the beat And everything is going...', '2019-05-29 18:00:14.402303-05'),
(3, 8, 'Buddy you''re a young man hard man Shoutin'' in the street gonna take on the world some day You got blood on yo'' face You big disgrace Wavin'' your banner all over the place.', '2019-05-29 17:21:14.402303-05'),
(3, 4, 'Engaging. It keeps your mind occupied while you wait.', '2019-05-29 06:12:14.402303-05'),
(4, 6, 'Bold shapes.', '2019-05-29 09:36:14.402303-05'),
(4, 4, 'Mission accomplished. It''s exquisite.', '2019-05-29 11:11:14.402303-05'),
(4, 8, 'Super thought out! Ahhhhhhh...', '2019-05-29 04:55:14.402303-05'),
(5, 1, 'I admire your spaces, friend.', '2019-05-29 10:09:14.402303-05'),
(5, 8, 'Let me take a nap... great shot, anyway.', '2019-05-29 23:18:14.402303-05'),
(5, 3, 'Fresh =) I adore the use of shape and avatar!', '2019-05-29 11:16:14.402303-05'),
(6, 7, 'It''s delightful not just admirable!', '2019-05-29 19:16:14.402303-05'),
(6, 4, 'My 53 year old nephew rates this atmosphere very elegant :)', '2019-05-29 14:32:14.402303-05'),
(6, 6, 'You just won the internet!', '2019-05-29 16:55:14.402303-05'),
(7, 4, 'Incredibly fab shot mate', '2019-05-29 17:15:14.402303-05'),
(7, 7, 'Baby blue. This is new school.', '2019-05-29 07:00:14.402303-05'),
(7, 1, 'Contrast.', '2019-05-29 13:12:14.402303-05'),
(8, 6, 'This shot has navigated right into my heart.', '2019-05-29 11:22:14.402303-05'),
(8, 4, 'This is killer work!!', '2019-05-29 22:10:14.402303-05'),
(8, 7, 'Sleek. So engaging.', '2019-05-29 18:21:14.402303-05'),
(9, 1, 'Such shot, many blur, so bold', '2019-05-29 09:09:14.402303-05'),
(9, 2, 'Extra fun mate', '2019-05-29 15:07:14.402303-05'),
(9, 7, 'Nice use of white in this shot!', '2019-05-29 16:09:14.402303-05'),
(10, 6, 'This atmosphere blew my mind.', '2019-05-29 20:09:14.402303-05'),
(10, 7, 'Killer work you have here.', '2019-05-29 03:16:14.402303-05'),
(10, 1, 'Shade, iconography, shot, concept – sleek :-)', '2019-05-29 11:19:14.402303-05'),
(11, 8, 'I want to learn this kind of shot! Teach me.', '2019-05-29 01:06:14.402303-05'),
(11, 7, 'That''s radiant and appealing, friend.', '2019-05-29 16:39:14.402303-05'),
(11, 5, 'I think I''m crying. It''s that magical.', '2019-05-29 17:09:14.402303-05'),
(12, 6, 'Just slick =)', '2019-05-29 10:54:14.402303-05'),
(12, 2, 'Can''t wait to try it out.', '2019-05-29 21:29:14.402303-05'),
(12, 5, 'Exquisite. So appealing.', '2019-05-29 17:23:14.402303-05'),
(13, 8, 'I like your shot =)', '2019-05-29 18:33:14.402303-05'),
(13, 6, 'I want to learn this kind of notification! Teach me.', '2019-05-29 12:16:14.402303-05'),
(13, 1, 'Just sublime m8', '2019-05-29 09:15:14.402303-05'),
(14, 5, 'Violet. Designgasmed all over this!', '2019-05-29 22:03:14.402303-05'),
(14, 2, 'Overly exquisite shapes :)', '2019-05-29 15:00:14.402303-05'),
(14, 8, 'Shape, layout, shot, design – cool m8', '2019-05-29 11:11:14.402303-05'),
(15, 2, 'It''s excellent not just amazing!', '2019-05-29 04:13:14.402303-05'),
(15, 7, 'Such shot, many type, so magnificent', '2019-05-29 10:32:14.402303-05'),
(15, 1, 'Exquisite dude Adore the use of type and playfulness!', '2019-05-29 20:16:14.402303-05'),
(16, 8, 'Looks sleek and gorgeous :)', '2019-05-29 14:28:14.402303-05'),
(16, 6, 'Immensely good mate', '2019-05-29 22:26:14.402303-05'),
(16, 2, 'Beastly work you have here.', '2019-05-29 19:12:14.402303-05'),
(17, 4, 'Americans want to take credit for everything.', '2019-05-29 12:43:14.402303-05'),
(17, 8, 'Nice picture but please get a better camera cause this one does your videos no justice.', '2019-05-29 15:26:14.402303-05'),
(17, 1, 'HEEEY HEEY BROTHERRR THAAT''S MY BROTHER :D', '2019-05-29 13:27:14.402303-05'),
(18, 8, 'useful tips thx', '2019-05-29 09:21:14.402303-05'),
(18, 7, 'It''s EXCELLENT for taking photos. Video quality is 720 but still looks great.', '2019-05-29 17:01:14.402303-05'),
(18, 1, 'ummm is this episode 2? a bunch of that stuff from the recap didn''t happen in ep 1.', '2019-05-29 02:49:14.402303-05'),
(19, 2, 'You''ve made me hungry for wine', '2019-05-29 17:09:14.402303-05'),
(19, 6, 'Amaxing picture!!', '2019-05-29 01:35:14.402303-05'),
(19, 7, 'Go Big or Go Home.', '2019-05-29 09:34:14.402303-05'),
(20, 1, 'this is a waste of money...i can''t to authorize this.', '2019-05-29 11:02:14.402303-05'),
(20, 3, 'Yeah, you can tune the center spot to be white hot and go about 3 miles. Thanks, Greg', '2019-05-29 16:19:14.402303-05'),
(20, 8, 'Wow, his voice is really the way it sounds on the records. They''re awesome live.', '2019-05-29 20:19:14.402303-05'),
(21, 2, 'They dont have that at Georgetown.', '2019-05-29 01:08:14.402303-05'),
(21, 5, 'Holy shit, i won. I never win anything, yay', '2019-05-29 19:33:14.402303-05'),
(21, 7, 'mmm tht sounds very nice, do you take theory or is tht improv', '2019-05-29 23:19:14.402303-05'),
(22, 8, 'MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANNNNNNNNNNNNNNNN!', '2019-05-29 11:29:14.402303-05'),
(22, 2, 'Love :)', '2019-05-29 18:27:14.402303-05'),
(22, 1, 'Fervently agree!', '2019-05-29 13:02:14.402303-05'),
(23, 8, 'you sure? I thought this was the military. Wow, could have fooled me. Honestly, get over it.', '2019-05-29 16:49:14.402303-05'),
(23, 2, 'SECOND!!', '2019-05-29 04:47:14.402303-05'),
(23, 5, 'boy don''t she feel warm tonight...', '2019-05-29 11:46:14.402303-05'),
(24, 2, 'The poor guy has been waiting soooooo long in the A&E queues he''s decided to go for a sleep.', '2019-05-29 19:19:14.402303-05'),
(24, 7, 'I thought it was longer. :( Sorry guys.', '2019-05-29 12:54:14.402303-05'),
(24, 8, 'I support it', '2019-05-29 19:00:14.402303-05'),
(25, 6, 'it works', '2019-05-29 13:09:14.402303-05'),
(25, 3, 'DAAAAMMNNN. right when i saw that shirt go up i was like---*FAVORITE*.', '2019-05-29 10:59:14.402303-05'),
(25, 4, 'wherever you are you''ll always be my muse.', '2019-05-29 08:23:14.402303-05'),
(26, 5, 'Nonsense - you obviously can''t recognise the nuances of Gaming', '2019-05-29 11:13:14.402303-05'),
(26, 8, 'Interesting story :D', '2019-05-29 19:07:14.402303-05'),
(26, 1, 'please make a tutorial it looks awesome', '2019-05-29 03:26:14.402303-05'),
(27, 6, 'LOL your welcome! :P', '2019-05-29 19:23:14.402303-05'),
(27, 1, 'There''s no replacement for displacement!', '2019-05-29 13:09:14.402303-05'),
(27, 4, 'Agreed love ya !', '2019-05-29 05:26:14.402303-05'),
(28, 3, 'iLoveHisHair ♥', '2019-05-29 22:29:14.402303-05'),
(28, 6, 'At last! Someone else who thinks there should be more coconut in this.', '2019-05-29 01:14:14.402303-05'),
(28, 2, 'Did you get sims in the future?', '2019-05-29 22:29:14.402303-05'),
(29, 7, 'THIS PICTURE IS THE BEST!!!! DUDE I LOVE IT!!!', '2019-05-29 03:41:14.402303-05'),
(29, 1, 'no joke I love it!', '2019-05-29 12:56:14.402303-05'),
(29, 3, 'does he still live with his parents?', '2019-05-29 10:19:14.402303-05'),
(30, 7, 'First!!!', '2019-05-29 01:00:14.402303-05'),
(30, 6, 'dear god... that''s a couple minutes I''ll never get back.', '2019-05-29 13:21:14.402303-05'),
(30, 4, 'what was this', '2019-05-29 11:23:14.402303-05'),
(31, 3, 'Omg.', '2019-05-29 05:34:14.402303-05'),
(31, 4, 'Don''t wanna get hit by it D:', '2019-05-29 05:26:14.402303-05'),
(31, 2, 'make a movie out of these costumes or something like that would be cool', '2019-05-29 21:15:14.402303-05'),
(32, 3, 'Best picture Ever (:', '2019-05-29 06:03:14.402303-05'),
(32, 5, 'I remember playing in that haha', '2019-05-29 09:12:14.402303-05'),
(32, 1, 'I agree with you there.', '2019-05-29 13:13:14.402303-05'),
(33, 7, 'Ha haha I love u too', '2019-05-29 16:16:14.402303-05'),
(33, 2, 'this is really good :)', '2019-05-29 07:07:14.402303-05'),
(33, 5, 'Lol was in that game??', '2019-05-29 10:00:14.402303-05');

INSERT INTO reactions
(post_id, comment_id, reactor_id, emoji_type)
VALUES
(1, 1, 6, 7),
(6, 18, 8, 5),
(5, NULL, 5, 1),
(32, 96, 4, 2),
(32, NULL, 7, 1),
(4, 11, 3, 2),
(1, NULL, 6, 5),
(14, 41, 1, 2),
(8, NULL, 8, 3),
(9, 28, 4, 5),
(15, 43, 2, 7),
(5, 14, 1, 5),
(2, 5, 4, 2),
(19, NULL, 7, 1),
(29, 87, 2, 6),
(28, NULL, 4, 3),
(4, NULL, 6, 5),
(20, 59, 5, 3),
(12, 35, 1, 2),
(16, NULL, 6, 4),
(19, 55, 8, 7),
(14, NULL, 4, 2),
(26, NULL, 7, 3),
(18, NULL, 1, 2),
(19, 55, 3, 5),
(17, NULL, 7, 4),
(32, NULL, 3, 2),
(24, 72, 8, 6),
(8, NULL, 4, 3),
(11, NULL, 7, 6),
(23, NULL, 6, 2),
(30, NULL, 7, 1),
(14, 42, 5, 1),
(33, NULL, 1, 3),
(22, 66, 3, 5),
(15, 44, 5, 7),
(8, 23, 8, 5),
(1, NULL, 5, 4),
(20, NULL, 7, 4),
(18, 54, 8, 4),
(12, NULL, 1, 6),
(24, NULL, 2, 1),
(14, 40, 5, 4),
(12, 35, 7, 7),
(3, 7, 1, 7),
(23, 69, 8, 2),
(8, 24, 6, 5),
(6, NULL, 2, 1),
(10, NULL, 6, 6),
(22, NULL, 4, 3),
(6, 18, 1, 6),
(24, NULL, 6, 2),
(11, NULL, 7, 5),
(10, NULL, 4, 6),
(23, 68, 7, 4),
(25, 74, 5, 6),
(3, 8, 4, 7),
(25, NULL, 5, 3),
(32, 94, 6, 4),
(29, 86, 8, 3),
(27, NULL, 2, 2),
(32, NULL, 1, 6),
(21, NULL, 5, 6),
(29, 87, 4, 4),
(21, 63, 2, 5),
(13, NULL, 1, 3),
(25, 75, 4, 7),
(28, 84, 6, 4),
(5, NULL, 2, 6),
(11, NULL, 8, 7),
(31, 91, 7, 4),
(10, 29, 2, 2),
(24, 72, 7, 5),
(23, NULL, 1, 6),
(20, NULL, 6, 5),
(6, NULL, 7, 3),
(14, 40, 6, 5);

INSERT INTO follows
(follower_id, followed_user_id)
VALUES
(1, 6),
(1, 5),
(1, 2),
(1, 3),
(2, 6),
(2, 4),
(2, 7),
(2, 3),
(3, 8),
(3, 1),
(3, 4),
(3, 7),
(4, 5),
(4, 8),
(4, 2),
(4, 6),
(5, 3),
(5, 7),
(5, 4),
(5, 8),
(6, 1),
(6, 2),
(6, 8),
(6, 4),
(7, 2),
(7, 8),
(7, 1),
(7, 6),
(8, 1),
(8, 5),
(8, 7),
(8, 4);

INSERT INTO events
(start_time, end_time, con_name, con_state, con_location, con_url)
VALUES
('2020/01/10', '2020/1/13', 'Anime Los Angeles', 'Ontario, California - United States', 'Ontario Convention Center', 'https://animelosangeles.org'),
('2020/01/11', '2020/1/13', 'OrcaCon', 'Bellevue, Washington - United States', 'Hilton Bellevue', 'http://www.orcacon.org'),
('2020/01/19', '2020/01/19', 'Kick Off the Cons', 'Renton, Washington - United States', 'Renton Technical College', 'https://www.rentoncitycomiccon.com/kick-off-the-cons-2/'),
('2020/02/09', '2020/02/09', 'Uchi-con', 'Chicago, Illinois - United States', 'Ida Noyes Hall and the Harper Memorial', 'http://uchi-con.com'),
('2020/02/09', '2020/02/09', 'Chibi Chibi Con', 'Olympia, Washington - United States', 'The Evergreen State College', 'https://chibichibicon.com'),
('2020/02/15', '2020/02/17', 'Gallifrey One', 'Los Angeles, California - United States', 'Mariott Los Angeles Airport Hotel', 'http://www.gallifreyone.com'),
('2020/02/15', '2020/02/17', 'Anime Milwaukee', 'Milqaukee, Wisconsin - United States', 'Hyatt Regency & Wisconsin Center', 'http://animemilwaukee.org'),
('2020/02/15', '2020/02/17', 'Katsucon', 'National Harbor, Maryland - United States', 'Gaylord National Motel and Convention', 'https://www.katsucon.org'),
('2020/02/15', '2020/02/17', 'RadCon', 'Pasco, Washington - United States', 'Red Lion Hotel', 'https://www.radcon.org'),
('2020/02/16', '2020/02/17', 'Long Beacg Comic Expo', 'Long Beach, California - United States', 'Long Beach Convention Center', 'http://longbeachcomicexpo.com/'),
('2020/02/22', '2020/02/24', 'Plattecon', 'Platteville, Wisconsin - United States', 'Ullsvik Hall 1 University Plaza', 'https://tabletop.events/conventions/plattecon-xxxii'),
('2020/03/14', '2020/03/17', 'Emerald City Comic Con', 'Seattle, Washington - United States', 'Washington State Convention Center', 'http://www.emeraldcitycomiccon.com/'),
('2020/03/15', '2020/03/17', 'Aselia Con', 'Irving, Texas - United States', 'Double Tree DFW North', 'https://aseliacon.com/'),
('2020/03/22', '2020/03/24', 'Zenkaikon', 'Lancaster, Pennsylvania - United States', 'Lancaster County Convention Center', 'https://zenkaikon.com/'),
('2020/03/29', '2020/03/31', 'No Brand Con', 'Wisconsin Dells, Wisconsin - United States', 'Chula Vista Resort', 'http://www.nobrandcon.org/p/'),
('2020/03/29', '2020/03/31', 'Anime Detour', 'Minneapolis, Minnesota - United States', 'Hyatt Regency Minneapolis', 'https://www.animedetour.com/'),
('2020/03/29', '2020/03/31', 'WonderCon', 'Anaheim, California - United States', 'Anaheim Convention Center', 'https://www.comic-con.org/wca'),
('2020/03/30', '2020/03/30', 'Baka Fest', 'Houston, Texas - United States', 'Park Inn Radisson Conference Center', 'https://www.facebook.com/events/2322763167955003/'),
('2020/04/18', '2020/04/21', 'Norwescon', 'Seatac, Washington - United States', 'Doubletree Hotel', 'http://www.norwescon.org'),
('2020/04/19', '2020/04/21', 'Sakura Con', 'Seattle, Washington - United States', 'Washington State Convention Center', 'http://sakuracon.org'),
('2020/04/19', '2020/04/21', 'Anime Boston', 'Boston, Massachusetts - United States', 'Hynes Convention Center', 'http://animeboston.com/'),
('2020/04/20', '2020/04/20', 'Karoshi-Con', 'DeKalb, Illinois - United States', 'Holmes Student Center', 'http://niuanime.x10host.com/karoshicon-general.html'),
('2020/04/26', '2020/04/28', 'LVL UP Expo', 'Las Vegas, Nevada - United States', 'Las Vegas Convention Center', 'https://lvlupexpo.com'),
('2020/04/26', '2020/04/28', 'Causeacon', 'Beckley, West Virginia - United States', 'Beckley-Raleigh County Community Center', 'http://www.causeacon.com/'),
('2020/04/27', '2020/04/27', 'Animetroplex', 'Denton, Texas - United States', 'Lone Star Indoor Sports Center', 'http://www.ampxcon3.com'),
('2020/05/03', '2020/05/05', 'Crypticon Seattle', 'Seatac, Washington - United States', 'Doubletree Hotel', 'https://www.crypticonseattle.com/'),
('2020/05/03', '2020/05/05', 'Northern FanCon', 'Prince George, BC - Canada', 'CN Centre', 'http://fancon.ca'),
('2020/05/03', '2020/05/05', 'Anime St. Louis', 'Saint Charles, Missouri - United States', 'St. Charles Convention Center', 'http://animestl.net/'),
('2020/05/04', '2020/05/04', 'Concinnity', 'Milwaukee, Wisconsin - United States', 'Cudahy Student Center', 'https://concinnitycon.weebly.com'),
('2020/05/10', '2020/05/12', 'Sabaku Con', 'Albuquerque, New Mexico - United States', 'Albuquerque Mariott', 'http://www.sabakucon.com/'),
('2020/05/16', '2020/05/19', 'Megacon Orlando', 'Orlando, Florida - United States', 'Orange County Convention Center', 'https://www.megaconorlando.com/home.html'),
('2020/05/17', '2020/05/19', 'Everfree Northwest', 'Seatac, Washington - United States', 'Doubletree Hotel', 'https://everfreenw.com/'),
('2020/05/17', '2020/05/19', 'Anime Central', 'Rosemont, Illinois - United States', 'Donald E. Stephens Convention Center', 'https://www.acen.org'),
('2020/05/23', '2020/05/26', 'Momocon', 'Atlanta, Georgia - United States', 'Georgia World Congress Center', 'https://www.momocon.com/'),
('2020/05/24', '2020/05/27', 'Balticon', 'Baltimore, Maryland - United States', 'Renaissance Baltimore Harborplace Hotel', 'https://www.balticon.org/wp53/'),
('2020/05/24', '2020/05/27', 'FanimeCon', 'San Jose, California - United States', 'SanJose Convention Center', 'https://www.fanime.com/'),
('2020/05/24', '2020/05/26', 'Anime North', 'Toronto, Toronto - Canada', 'Toronto Congress Centre', 'https://www.animenorth.com/live/'),
('2020/05/30', '2020/06/02', 'Colossalcon', 'Sandusky, Ohio - United States', 'Kalahari Resort', 'http://www.colossalcon.com'),
('2020/05/31', '2020/06/02', 'Anime Conji', 'San Diego, California - United States', 'Mission Valley Mariott Hotel', 'http://animeconji.org'),
('2020/06/01', '2020/06/02', 'Lilac City Comic Con', 'Spokane, Washington - United States', 'Spokane Convention Center', 'https://lilaccitycomicon.webs.com/'),
('2020/06/06', '2020/06/09', 'A-Kon', 'Fort Worth, Texas - United States', 'Fort Worth Convention Center', 'https://a-kon.com');

/* TESTING */

-- SELECT *
-- FROM users;

-- SELECT *
-- FROM posts;

-- SELECT *
-- FROM comments;

-- SELECT *
-- FROM reactions;

-- SELECT *
-- FROM follows;

-- SELECT *
-- FROM events;
