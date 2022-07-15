import { Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import bcrypt from 'bcrypt';

import User from '../entity/User';
import Sub from '../entity/Sub';
import Post from '../entity/Post';
import Comment from '../entity/Comment';
import Vote from '../entity/Vote';

function timePlus(duration = 0) {
  const time = new Date('2020-11-07 07:01:43.18').getTime();

  return new Date(time + duration).toISOString();
}

export default class CreateData implements Seeder {
  public async run(_: any, connection: Connection): Promise<any> {
    const password = await bcrypt.hash('123456', 6);

    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Create users
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          username: 'john',
          email: 'john@email.com',
          password,
          createdAt: timePlus(),
          updatedAt: timePlus(),
        },
        {
          username: 'jane',
          email: 'jane@email.com',
          password,
          createdAt: timePlus(minute * 5),
          updatedAt: timePlus(minute * 5),
        },
      ])
      .execute();

    const john = await User.findOne({ username: 'john' });
    const jane = await User.findOne({ username: 'jane' });

    // Create subs
    await connection
      .createQueryBuilder()
      .insert()
      .into(Sub)
      .values([
        {
          name: 'Gaming',
          title: 'Everything about gaming',
          description:
            'A subreddit for (almost) anything related to games - video games, board games, card games, etc. (but not sports).',
          user: john,
          createdAt: timePlus(minute * 20),
          updatedAt: timePlus(minute * 20),
        },
        {
          name: 'Funny',
          title: 'Everything Funny',
          description:
            "Welcome to r/Funny, Reddit's largest humour depository.",
          user: jane,
          createdAt: timePlus(minute * 25),
          updatedAt: timePlus(minute * 25),
        },
        {
          name: 'Movies',
          title: 'Everything about movies',
          description:
            'The goal of /r/Movies is to provide an inclusive place for discussions and news about films with major releases. ',
          user: john,
          createdAt: timePlus(minute * 30),
          updatedAt: timePlus(minute * 30),
        },
        {
          name: 'Books',
          title: 'Everything about books',
          description:
            'This is a moderated subreddit. It is our intent and purpose to foster and encourage in-depth discussion about all things related to books, authors, genres, or publishing.',
          user: john,
          createdAt: timePlus(hour),
          updatedAt: timePlus(hour),
        },
        {
          name: 'News',
          title: 'Everything about the news',
          description:
            'The place for news articles about current events in the United States and the rest of the world. Discuss it all here.',
          user: jane,
          createdAt: timePlus(hour),
          updatedAt: timePlus(hour),
        },
        {
          name: 'AskReddit',
          title: 'Ask reddit a question',
          description:
            'r/AskReddit is the place to ask and answer thought-provoking questions.',
          user: jane,
          createdAt: timePlus(hour),
          updatedAt: timePlus(hour),
        },
      ])
      .execute();

    const gaming = await Sub.findOne({ where: { name: 'Gaming' } });
    const askReddit = await Sub.findOne({ where: { name: 'AskReddit' } });
    const movies = await Sub.findOne({ where: { name: 'Movies' } });
    const books = await Sub.findOne({ where: { name: 'Books' } });

    // Create posts
    await connection
      .createQueryBuilder()
      .insert()
      .into(Post)
      .values([
        {
          // id: 1
          identifier: 'rggenVY',
          title: 'Can we please boycott Star Wars battlefront 2',
          slug: 'can_we_boycot_star_wars',
          body: "I bought EA Star Wars Battlefront as a fan of Star Wars and felt ripped off. Played the beta of Star Wars battlefront 2 and you still can't just get in a vehicle, it feels so fake. Why is Rey in the clone wars!? That is all bad, but EA have just totally taken the piss with abusing Star Wars fans and cutting their games into little pieces and bleeding the fan base dry.I've had enough.",
          user: john,
          sub: gaming,
          createdAt: timePlus(minute * 20),
          updatedAt: timePlus(minute * 20),
        },
        {
          // id: 2
          identifier: '00fOyPQ',
          title: 'Valve announces Half-Life: Alyx, its first flagship VR game',
          slug: 'Valve_announce_half_life_alyx',
          body: 'Two years and nine months after announcing it would build three (3) full-length VR games — a number that Valve Software has historically never been able to count to before, and one of the most exciting announcements in VR’s short history so far — the company has today announced Half-Life: Alyx, the first new game in the acclaimed Half-Life series in well over a decade. ',
          user: jane,
          sub: gaming,
          createdAt: timePlus(hour),
          updatedAt: timePlus(hour),
        },
        {
          // id: 3
          identifier: 'IvzYvbG',
          title: 'Red Dead Online receives heartfelt goodbye from fans',
          slug: 'Red_Dead_Online_receives_heartfelt_goodbye',
          body: 'Many thought Red Dead Online would be a phenomenon prior to release. After all, Rockstar had millions of people tearing up Los Santos daily in GTA Online, so putting that familiar formula in the old west seemed like it would be an instant hit.',
          user: john,
          sub: gaming,
          createdAt: timePlus(hour + minute * 30),
          updatedAt: timePlus(hour + minute * 30),
        },
        {
          // id: 4
          identifier: 'DnwJSvj',
          title:
            'Top Gun: Maverick’ Catapults Past $1B At Worldwide Box Office',
          slug: 'Top_Gun_Maverick_Catapults_Past_1Billion',
          body: ' With the actuals now counted, Paramount/Skydance’s Top Gun: Maverick has soared to $1.007B global through Sunday. That includes $520.8M domestically and $486.1M from 65 international markets for the Tom Cruise-starrer.',
          user: jane,
          sub: movies,
          createdAt: timePlus(minute * 40),
          updatedAt: timePlus(minute * 40),
        },
        {
          // id: 5
          identifier: 'saUwqdP',
          title: "News : Tony Sirico Dead: 'The Sopranos' Actor Was 79",
          slug: 'News_Tony_Sirico_Dead',
          body: 'Tony Sirico, the actor known for playing mobster Peter Paul “Paulie Walnuts” Gualtieri on “The Sopranos,” died Friday, Variety confirmed with his manager. He was 79.',
          user: john,
          sub: movies,
          createdAt: timePlus(hour + minute * 40),
          updatedAt: timePlus(hour + minute * 40),
        },
        {
          // id: 6
          identifier: 'ckVoiPf',
          title:
            'Those Mythical Four-Hour Versions Of Your Favourite Movies Are Probably Garbage',
          slug: 'Those_Mythical_Four_Hour_Verions_Of_Your_Favourite',
          body: 'Major directors seem to love spending their promotional tours boasting about how long the early cuts of their films were. “Sure, the released version is two hours, but man, you gotta see the five-hour version we had earlier in the process.” Baz Luhrmann is the latest to pull this out, regarding his new Elvis film, but this happens with nearly every blockbuster film, and even some non-blockbusters. Typically, websites run clickbaity headlines about it, fans fall over themselves clamouring to see the longer version, and if they’re good enough at manipulating opinion metrics, they get their wish.',
          user: jane,
          sub: movies,
          createdAt: timePlus(3 * hour),
          updatedAt: timePlus(3 * hour),
        },
        {
          // id: 7
          identifier: 'tbkzHxF',
          title:
            'I’m Brandon Sanderson, a bestselling fantasy author who somehow produced the highest-funded Kickstarter campaign of all time. AMA!',
          slug: 'Im_Brandon_Sanderson_AMA',
          user: john,
          sub: books,
          createdAt: timePlus(9 * day),
          updatedAt: timePlus(9 * day),
        },
        {
          // id: 8
          identifier: 'CEPVxjR',
          title:
            'Unpopular opinion: if it’s your own copy of a book I don’t get why dog-earing is such a big deal',
          slug: 'Unpopular_opinion',
          body: 'I get it if it’s a library copy or you’re borrowing a copy from someone, that’s just basic respect of others property. But I’ve had people watch me dog-ear my own book and try and like lecture me on the fact that it’s “wrong” to do that. I get if you don’t want to dog-ear your own books but I’m kind of getting tired of this attitude that books are sacred or something and to do any “harm” to them is a terrible action. I like dog-earring my books, I like writing in my books, generally as long as the text of the book is readable I don’t care what condition it’s in.',
          user: jane,
          sub: books,
          createdAt: timePlus(10 * day),
          updatedAt: timePlus(10 * day),
        },
        {
          // id: 9
          identifier: 'FyztVqe',
          title:
            'Kellyanne Conway’s Book Goes from Bestseller to No Seller in Record 3 Weeks',
          slug: 'Kellyanne_Conways_Book_Goes_From_Bestseller',
          body: 'So here’s the deal on “Here’s the Deal,” a memoir from Trump Alternative Facts expert Kelly Conway.The book has dropped off the New York Times best seller list in record time. Four weeks ago it was number 1 with alleged 25,000 copies sold.This past week, it’s off the top 15. Sales for last week were 5,000 copies, down from 8,000 the previous week.',
          user: john,
          sub: books,
          createdAt: timePlus(10 * day + 2 * hour),
          updatedAt: timePlus(10 * day + 2 * hour),
        },
        {
          // id: 10
          identifier: 'kk0GXky',
          title: 'I think refusing to name your ghostwriters is immoral',
          slug: 'I_think_refusing_to_name_your_ghostwrites',
          body: 'Even if the ghostwriter is okay with their arrangement (and I think it is exploitative and should be regulated), they are still just agreeing to work with the author and the publisher to deceive the consumer. This should not be allowed under current law.',
          user: john,
          sub: books,
          createdAt: timePlus(3 * day),
          updatedAt: timePlus(3 * day),
        },
        {
          // id: 11
          identifier: 'aWbiMTf',
          title:
            "What if God came down one day and said It's pronounced 'Jod' then left?",
          slug: 'What_if_God_came_down',
          user: john,
          sub: askReddit,
          createdAt: timePlus(4 * day),
          updatedAt: timePlus(4 * day),
        },
        {
          // id: 12
          identifier: 'eOMqOFS',
          title:
            "Bill Gates said, 'I will always choose a lazy person to do a difficult job because a lazy person will find an easy way to do it.' What's a real-life example of this?",
          slug: 'Bill_Gates_Said',
          body: '',
          user: jane,
          sub: askReddit,
          createdAt: timePlus(5 * day),
          updatedAt: timePlus(5 * day),
        },
        {
          // id: 13
          identifier: 'u1PZphn',
          title:
            "What if Earth is like one of those uncontacted tribes in South America, like the whole Galaxy knows we're here but they've agreed not to contact us until we figure it out for ourselves?",
          slug: 'What_if_earth',
          body: 'Well, that do you think ?',
          user: john,
          sub: askReddit,
          createdAt: timePlus(6 * day),
          updatedAt: timePlus(6 * day),
        },
        {
          // id: 14
          identifier: 'HylUYd5',
          title: 'Dove chocolate taste better than their soap.',
          slug: 'dove_chocolate_taste_better_than_their_soap',
          user: john,
          sub: askReddit,
          createdAt: timePlus(day + hour),
          updatedAt: timePlus(day + hour),
        },
        {
          // id: 15
          identifier: 'PwsDv25',
          title: 'What free things online should everyone take advantage of?',
          slug: 'What_free_things_online',
          user: jane,
          sub: askReddit,
          createdAt: timePlus(day + 2 * hour),
          updatedAt: timePlus(day + 2 * hour),
        },
        {
          // id: 16
          identifier: 'iqx3acA',
          title:
            'Steve Irwin has you pinned down in a headlock, what cool facts does he tell the audience about you and your habitat?',
          slug: 'Steve_Irwin_has_you_pinned',
          user: john,
          sub: askReddit,
          createdAt: timePlus(day + 6 * hour),
          updatedAt: timePlus(day + 6 * hour),
        },
        {
          // id: 17
          identifier: 'oCSW50J',
          title:
            'With Christmas 364 days away, people who already have their decorations up, why?',
          slug: 'With_christmas_364_days_away',
          user: jane,
          sub: askReddit,
          createdAt: timePlus(day + 8 * hour),
          updatedAt: timePlus(day + 8 * hour),
        },
      ])
      .execute();

    const post6 = await Post.findOne(6);
    const post7 = await Post.findOne(7);
    const post8 = await Post.findOne(8);
    const post9 = await Post.findOne(9);

    // Create comments
    await connection
      .createQueryBuilder()
      .insert()
      .into(Comment)
      .values([
        {
          body: 'This is a placeholder comment',
          post: post7,
          user: john,
          identifier: 'oCSW50J',
          createdAt: timePlus(10 * day + 5 * hour),
          updatedAt: timePlus(10 * day + 5 * hour),
        },
        {
          body: 'Poor cows hahaha',
          post: post7,
          user: jane,
          identifier: 'u1PZphn',
          createdAt: timePlus(10 * day + 3 * hour),
          updatedAt: timePlus(10 * day + 3 * hour),
        },
        {
          body: 'To work even when I didnt have to!!',
          post: post6,
          user: john,
          identifier: 'eOMqOFS',
          createdAt: timePlus(9 * day + hour * 2),
          updatedAt: timePlus(9 * day + hour * 2),
        },
        {
          body: "It's funny cuz it's true haha!",
          post: post8,
          user: john,
          identifier: 'PwsDv25',
          createdAt: timePlus(10 * day + 2 * hour),
          updatedAt: timePlus(10 * day + 2 * hour),
        },
        {
          body: "At least we're enjoying the milk I guess hihi",
          post: post7,
          user: jane,
          identifier: 'rggenVY',
          createdAt: timePlus(10 * day + 4 * hour),
          updatedAt: timePlus(10 * day + 4 * hour),
        },
        {
          body: 'This is so bad, I dont know why im laughing Hahahaha!!',
          post: post9,
          user: jane,
          identifier: 'CEPVxjR',
          createdAt: timePlus(10 * day + 7 * hour),
          updatedAt: timePlus(10 * day + 7 * hour),
        },
      ])
      .execute();

    const comment1 = await Comment.findOne(1);
    const comment2 = await Comment.findOne(2);

    // Create votes
    await connection
      .createQueryBuilder()
      .insert()
      .into(Vote)
      .values([
        { value: 1, user: john, post: post9 },
        { value: 1, user: jane, post: post9 },
        { value: 1, user: jane, post: post8 },
        { value: 1, user: john, comment: comment1 },
        { value: 1, user: jane, comment: comment1 },
        { value: 1, user: john, comment: comment2 },
      ])
      .execute();
  }
}
