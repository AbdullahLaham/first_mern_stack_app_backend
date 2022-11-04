import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
    try {
        const { page } = req.query;
        const limit = 8;
        const startIndex = (parseInt(page) - 1) * limit ; // get the starting index of every page
        const total = await PostMessage.countDocuments({});
        const posts = await PostMessage.find().sort({ _id : -1, }).limit(limit).skip(startIndex);
        
        console.log(posts);
        res.status(200).json({data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / limit)});
    }
    catch (error) {
        res.status(400).json({message: error.message});
    }
}

export const getPost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await PostMessage.findById(id);
        // console.log(postMessages);
        res.status(200).json(post);
    }
    catch (error) {
        res.status(400).json({message: error.message});
    }
}


export const getSearchedPost = async (req, res) => { 
    // we use query for thinds like searching
    // we use params for thinds like get a specific resource

    const {searchQuery, tags} = req.query;
    try {
       const title = new RegExp(searchQuery, 'i') // case sensitive
        // is there is a tag in this specific array of tags that matches our query
        const posts = await PostMessage.find({ $or : [  { title }, {tags: {$in : tags.split(",")}} ]}) // find all posts that matches one of those two criteria the first : title as we typed in frontend , or one of the tags in our array of tags matches the input.  
        console.log(posts)
        res.json({data: posts})
    }
    catch (error) {
        res.status(404).json({message: "the searched posts not found "});
    }
}
export const createPost = async (req, res) => {
    // const { title, message, selectedFile, creator, tags } = req.body;
    const post = req.body;
    // const newPostMessage = new PostMessage({ title, message, selectedFile, creator, tags })
    const newPostMessage = new PostMessage({...post, creator: req?.userId, createdAt: new Date().toISOString()})

    try {
        await newPostMessage.save();

        res.status(201).json(newPostMessage );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
    
}
export const updatePost = async (req, res) => {
    const { id: _id } = req.params; // Re_Name id with _id
    const post = req.body; // the post after updating
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        const post = req.body;

        return res.status(404).send('No post with this id')
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, { new: true });
    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const {id: _id} = req.params;
    console.log('delete');
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('No post with this id');
    }
    await PostMessage.findByIdAndRemove(_id);
    res.json({message: 'post deleted successfully'})
}

export const commentPost = async (req, res) => {
    // if (!req?.userId) {
    //     return res.json({message: 'Unauthenticated'})
    // }
    const {id} = req.params;
    // console.log('idid', id);console.log('idid', id);console.log('idid', id);
    if (mongoose.Types.ObjectId.isValid(id)) {
        const {value} = req.body;

        let post = await PostMessage.findById(id);
        post.comments.push(String(value));

        const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true});
        
        res.status(200).json(updatedPost);
        console.log('ddddddddddddd',updatedPost);        
    } else {
        return res.status(404).send('No post with this id');
    }
    
}

export const likePost = async (req, res) => {
    const { id } = req.params;
    if (!req?.userId) { // the user is not authonticated with the middleware
        return res.json({ message: 'Unauthenticated' })
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('No post with this id');
    }
    let post = await PostMessage.findById(id);
    const index = post?.likes?.includes(String(req?.userId));
    console.log(post?.likes)
    // console.log(post.likes, String(req?.userId))
    if (!index) {
        // like the post 
        post.likes.push(String(req?.userId)); 
    } else {
        // dislike the post 
        post['likes'] = post?.likes?.filter(id => {
            // console.log(id, String(req?.userId));
            return id != String(req?.userId)
        });
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true});
    res.json(updatedPost);
}

