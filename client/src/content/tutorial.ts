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
    title: 'Welcome to my clone of Reddit',
    text1:
      'This project is intended to be a faithful clone of the socail media site Reddit.com',
    text2:
      'Continue ahead if you would like to learn about some of this sites features or exit above to jump right in !',
  },
];

export default content;
