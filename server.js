import express from 'express';
import { join } from 'path';
 
import process from 'process';

 
const app = express();

app.use(express.static('/home/site/wwwroot/dist'));

app.get('*', (req, res) => {
    res.sendFile(join('/home/site/wwwroot/', 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});