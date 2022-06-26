import app from './server';
import { createTypeormConnection } from './Utils/createTypeormConnection';

app.listen(process.env.PORT, async () => {
  console.log(`Server running at http://localhost:5000`);
  try {
    console.log('creating connection');

    await createTypeormConnection();
    console.log('database connected');
  } catch (error) {
    console.log(error);
  }
});
