const express = require('express')
const mongoose = require('mongoose');
const Todo = require("./models/todo");

const port = 3000
const app = express()
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));


app.get('/', async (req, res) => {
  const todos = await Todo.find();
  res.render("index", { todos , activeFilter: "all" });
})

app.post('/create', async (req, res) => {
  const { title } = req.body

  const todo = await Todo.create({
    title,
    check: false
  })

  res.redirect("/")
})

app.get('/delete/:id', async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  res.redirect('/')
})

app.get('/edit/:id', async (req, res) => {
  const { id } = req.params
  const todo = await Todo.findById(id)
  res.render('edit', { todo: todo })
})

app.post('/edit/:id', async (req, res) => {
  const { title } = req.body
  const { id } = req.params
  await Todo.findByIdAndUpdate(id, {
    title
  })
  res.redirect('/')
})

app.post('/check/:id', async (req, res) => {
  const { id } = req.params

  const check = req.body.done === "true"

  await Todo.findByIdAndUpdate(id, { check })

  res.redirect('/')
})

app.get("/filter/:type", async (req, res) => {
  const { type } = req.params

  let todos;

  if (type === 'completed') todos = await Todo.find({ check: true })
  else if (type === 'pending') todos = await Todo.find({ check: false })
  else res.redirect('/')

  res.render("index", { todos , activeFilter: type})
})


app.get("/deleteall", async(req, res)=>{
  await Todo.deleteMany({check: true})
  res.redirect('/')
})

app.get('/search', async (req, res) => {
  const q = req.query.q;
  const todos = await Todo.find({ title: { $regex: q, $options: "i" } });
  res.render("index", { todos });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
