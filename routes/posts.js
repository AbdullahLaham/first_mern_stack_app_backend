import express from "express";
import {getSearchedPost, getPosts, createPost, updatePost, deletePost, likePost, getPost, commentPost} from '../controllers/posts.js';
import auth from '../middleware/auth.js'
const router = express.Router();
router.get('/', getPosts);

router.get('/search', getSearchedPost);
router.get('/:id', getPost)
router.post('/', auth ,createPost);
router.patch('/:id', auth ,updatePost);
router.delete('/:id', auth ,deletePost);
router.patch('/:id/likePost', auth ,likePost);
router.patch('/:id/commentPost/', auth, commentPost);z
export default router;