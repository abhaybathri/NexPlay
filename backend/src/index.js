import { dbConnection } from "./db/dbConnection.js";
import app from "./app.js";
const port = process.env.PORT

dbConnection()
.then(()=>{
    app.listen(port, () => {
        console.log('server is running on port ', port);
    })
})
.catch((err)=>{
    console.log('server is not able to connect with mongodb',err);
})



