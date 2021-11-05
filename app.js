const ex = require('express');
const app = ex();
const port = 8080;

app.use(ex.static("public"));

app.get('/csw.txt', function(req,res){
    res.sendFile(__dirname+"/csw.txt")
});

app.listen(port, ()=> {
    console.log(`http://localhost:${port}`);
})