const express = require('express');
// const { MongoServerClosedError } = require('mongodb');
// // const { default: mongoose } = require('mongoose');
// //http methods GET,POST,DELETE,PUT/PATCH

const mongoose=require('mongoose')
const app = express()

app.use(express.json());


const {v4 : uuidv4} = require("uuid")

mongoose.connect("mongodb://localhost:27017/expenses").then(()=>{
    console.log("Connected to MongoDB");
});

const expenseSchema=new mongoose.Schema({
    id:{type:String,required:true,unique:true},
    title:{type:String,required:true},
    amount:{type:Number,required:true}
})

const Expense=mongoose.model("Expense",expenseSchema);


// const expenses = [
//     {
//         id: 1,
//         title: "Food",
//         amount: 200
//     }, {
//         id: 2,
//         title: "Truf",
//         amount: 500
//     }, {
//         id: 3,
//         title: "Camer",
//         amount: 300
//     }, {
//         id: 4,
//         title: "Phone",
//         amount: 5000
//     }
// ]

app.get('/api/expenses', async(req, res) => {
    try{
    const expenses=await Expense.find();
    if(!expenses){
        res.status(404).send({message:"No expense found"})
    }
    res.status(200).json(expenses);
}catch(error){
    res.status(500).json({message: "Internal Server Error"})

}
})

// app.get('/api/expenses/:id', (req, res) => {
//     const {id}=req.params;
//     const expense = expenses.find( expense => expense.id == id)
//     if(!expense){
//         res.status(404).json({message: "Not Found"})
//     }
//     res.status(200).json(expense)
// })


app.delete("/api/expenses/:id",async()=>{
    const {id}=req.params;
    try{
        const deletedexpense=await Expense.findOneAndDelete({id})
        if(!deletedexpense){
            res.status(404).json({message:"Expense not found"})
        }
        res.status(200).json({message:"Deleted Successfully"})
    }catch(error){
        res.status(400).json({message:"Internal Server Error"})
    }
})


app.get('/api/expenses/:id', async(req,res)=>{
    try{
    const {id} = req.params;
    const expense = await Expense.findOne({id})
    if(!expense){
        res.status(404).json({message: "Not Found"})
    }
    res.status(200).json(expense)
}
catch(error){
    res.status(500).json({message: "Internal Server Error"})
}
});



app.post('/api/expenses',async(req,res)=>{

    try{
    const {title,amount}=req.body
    if(!title || !amount){
        res.status(400).json({message:"Please provide both title and amount"});
    }
    const newExpense = new Expense({
        id:uuidv4(),
        title,
        amount
    })

    const savedExpense = await newExpense.save()
    res.status(201).json(savedExpense)
    // res.end()
}
catch(error){
    res.status(500).json({message: "Internal Server Error"})
}
})

app.listen(3000,()=>{
    console.log("Server is running")
})


app.put('/api/expenses/:id',async(req,res)=>{
    const {id} = req.params
    const {title,amount}=req.body
    try{
        if(!title && !amount){
            res.status(200).json({message : "No Value Provided for Update"})
            return
        }
        const updatedExpense = await Expense.findOneAndUpdate({id},{$set:{title,amount}},{new:true})
        if(!updatedExpense){
            res.status(201).json({message: "Expense not found"})
            return
        }
        res.status(200).json({message: "Updated Successfully"})
    }
    catch(error){
        res.status(400).json({ message: "Internal Server Error" })
    }
})