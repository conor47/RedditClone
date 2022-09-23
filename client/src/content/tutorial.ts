interface page {
  title: string;
  text1: string;
  image?: string;
  text2: string;
}

const content: page[] = [
  {
    title: 'Welcome to my clone of Reddit',
    text1:
      'This project is intended to be a faithful clone of the social media site Reddit.com',
    text2:
      'Continue ahead if you would like to learn about some of this sites features or click the X in the top right to jump right in',
  },
  {
    title: 'Registration and Login',
    text1:
      'If you want to create communities and posts, leave comments, cast votes and build your own custom homepage you will need an account ! Register for a new account or login to your existing one.',
    image:
      'https://media3.giphy.com/media/5HY3gbwqIPF7bqrrrm/giphy.gif?cid=790b761184536b06b533be36c6332ad8d6e998178fb96d09&rid=giphy.gif&ct=g',
    text2: '',
  },
  {
    title: 'Homepage and Frontpage',
    text1:
      'Your homepage is where you will see posts from the communities to which you are subscribed. If you have just created your account you will need to join some communities for this to become populated! ',
    text2:
      'r/all is the frontpage of the site, this is where you can see posts from communities all accross the site',
    image:
      'https://media0.giphy.com/media/TEPuQo5xl2Mptvj4vW/giphy.gif?cid=790b761194513c1c1b6fc6c5dfc92a2dc8a1662d1bbf5273&rid=giphy.gif&ct=g',
  },
  {
    title: 'Joining communities',
    text1:
      'Join your favourite communities so that you will not miss any of their posts',
    text2:
      'Posts from communities you have joined will show on your personalised homepage',
    image:
      'https://media2.giphy.com/media/6g8yYksVkOwBQdHaXo/giphy.gif?cid=790b7611f4d1c7dadcaa8d49af12a3e0897c8ef5f45215f5&rid=giphy.gif&ct=g',
  },
  {
    title: 'Creating communities',
    text1:
      'Have something you are passionate about ? Create a community and find like minded people',
    text2: 'Give your community a name, title, description and an image',
    image:
      'https://media1.giphy.com/media/YYM6Q1eiEVYavO9mad/giphy.gif?cid=790b7611a9eb60a54484de4a18eb7a8e7d28dccb3ddd8312&rid=giphy.gif&ct=g',
  },
  {
    title: 'Creating posts',
    text1:
      'Have something you find interesting ? Create a post and show / tell others !',
    text2: 'Posts can be either textual or image based',
    image:
      'https://media3.giphy.com/media/fAikd8JFoVidS8VPTq/giphy.gif?cid=790b7611a742d00359f6c5fe1d715a027ae90fb44c8cefe8&rid=giphy.gif&ct=g',
  },
  {
    title: 'Casting votes',
    text1:
      'Let others know what you think of their posts / comments by leaving a vote',
    text2:
      'Your vote contributes to the post / comment score and affects it in the overall ranking',
    image:
      'https://media3.giphy.com/media/P8S3kbYsP9QC05GeLU/giphy.gif?cid=790b7611e11920b56713470cf5124d8d52a9c6023bb6de52&rid=giphy.gif&ct=g',
  },
  {
    title: 'Leaving comments',
    text1:
      'Leave comments and engage in discussion on posts. Reply to comments and participate in comment threads.',
    text2: 'You can edit and delete your previously posted comments',
    image:
      'https://media4.giphy.com/media/u76jmnLbt64FdNggYr/giphy.gif?cid=790b7611b5cb530085b00d183085aeff95feccb0c86541dc&rid=giphy.gif&ct=g',
  },
];

export default content;
