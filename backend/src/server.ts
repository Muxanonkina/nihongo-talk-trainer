import app from './app';
import { env } from './config/env';

const PORT = env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running in ${env.NODE_ENV} mode on port ${PORT}`);
});
