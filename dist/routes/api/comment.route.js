"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = void 0;
const express_1 = require("express");
const comment_controller_1 = require("~/controllers/comment.controller");
exports.commentRouter = (0, express_1.Router)();
exports.commentRouter.post('/:product_id/create', comment_controller_1.CommentController.createComment);
exports.commentRouter.get('/:product_id', comment_controller_1.CommentController.getComments);
exports.commentRouter.delete('/:product_id/:comment_id', comment_controller_1.CommentController.deleteComments);
