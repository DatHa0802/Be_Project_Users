const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')

const Post = require('../models/Post')




// @route Get api/posts
// @desc Create post

router.get('/', verifyToken, async(req, res) => {
    try {
        const posts = await Post.find({user: req.userId}).populate('user','username')
        res.json({success: true, posts})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, messege:'Internal server error'})
    }
})

// @route Post api/posts
// @desc Create post 
// @access Private 
router.post('/',verifyToken, async(req,res) => {
    const{firstName, lastName, email, gender} =req.body
    if(!email)
    return res.status(400).json({success: false, messege: ' is require'})
    try {
        const newPost = new Post({firstName, lastName, email, 
        gender, 
        user: req.userId
    })
    await newPost.save()

    res.json({success: true, messege: "Happy Users", post: newPost})
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, messege: 'Internal server error'})
    }
})

//@route Put api/posts
//@desc Update post
//@access Private
router.put('/:id',verifyToken, async(req,res) => {
    const{firstName, lastName, email, gender} = req.body

    if(!firstName)
    return res.status(400).json({success: false, messege: 'Firsr Name is require'})
    try {
        let UpdatePost = {
            firstName: firstName || '',
            lastName: lastName || '',
            email: email || '',
            gender: gender || 'Other'
        }
        const postUpdateCondition = {_id: req.params.id, user: req.userId}
        UpdatePost = await Post.findOneAndUpdate(postUpdateCondition, UpdatePost, {new: true})

        //User not authorised to update post
        if(!UpdatePost)
        return res.status(401).json({success: false, messege:'Post not found or user not authorised'})
        res.json({success: true, messege: 'Excellent progress!', post : UpdatePost})
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, messege: 'Internal server error'})
    }
    // User Delete
    router.delete('/:id', verifyToken, async(req,res) => {
        try {
            const postDeleteCondition = {_id: req.params.id, user: req.userId}
            const deletePost = await Post.findByIdAndDelete(postDeleteCondition)
            if(!deletePost)
            return res.status(401).json({success: false, messege:'Post not found or user not authorised'})
            res.json({success: true,  post : deletePost})
        } catch(error){
            console.log(error)
            res.status(500).json({ success: false, messege: 'Internal server error'})
        }
    })
})

module.exports = router