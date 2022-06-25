import { createConnection } from 'typeorm';

import app from './server';

app.listen(process.env.PORT, async () => {
  console.log(`Server running at http://localhost:5000`);
  try {
    await createConnection();
    console.log('database connected');
  } catch (error) {
    console.log(error);
  }
});
