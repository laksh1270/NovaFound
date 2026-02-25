"use client";

import { useState } from "react";
import { createComment } from "@/lib/actions";
import Image from "next/image";

type Reply = {
    _id: string;
    content: string;
    _createdAt: string;
    author: { _id: string; name: string; image: string; username: string };
};

type Comment = {
    _id: string;
    content: string;
    _createdAt: string;
    author: { _id: string; name: string; image: string; username: string };
    replies: Reply[];
};

type Props = {
    startupId: string;
    initialComments: Comment[];
    sessionUserId?: string;
    startupOwnerId: string;
};

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

export default function CommentsClient({
    startupId,
    initialComments,
    sessionUserId,
    startupOwnerId,
}: Props) {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [commentText, setCommentText] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || loading) return;
        setLoading(true);
        const res = await createComment(startupId, commentText);
        if (res.status === "SUCCESS") {
            const newComment: Comment = {
                _id: res._id!,
                content: commentText.trim(),
                _createdAt: new Date().toISOString(),
                author: { _id: sessionUserId!, name: "You", image: "", username: "" },
                replies: [],
            };
            setComments((prev) => [...prev, newComment]);
            setCommentText("");
        }
        setLoading(false);
    };

    const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
        e.preventDefault();
        if (!replyText.trim() || loading) return;
        setLoading(true);
        const res = await createComment(startupId, replyText, parentId);
        if (res.status === "SUCCESS") {
            setComments((prev) =>
                prev.map((c) =>
                    c._id === parentId
                        ? {
                            ...c,
                            replies: [
                                ...c.replies,
                                {
                                    _id: res._id!,
                                    content: replyText.trim(),
                                    _createdAt: new Date().toISOString(),
                                    author: { _id: sessionUserId!, name: "You", image: "", username: "" },
                                },
                            ],
                        }
                        : c
                )
            );
            setReplyText("");
            setReplyingTo(null);
        }
        setLoading(false);
    };

    return (
        <div className="mt-10 border-t-[3px] border-black pt-8 space-y-6">
            <h2 className="text-24-black">Comments ({comments.length})</h2>

            {/* Post Comment Form */}
            {sessionUserId ? (
                <form onSubmit={handleSubmitComment} className="flex gap-3">
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        rows={2}
                        className="flex-1 border-[3px] border-black rounded-xl p-3 text-sm font-work-sans resize-none outline-none focus:border-primary"
                    />
                    <button
                        type="submit"
                        disabled={loading || !commentText.trim()}
                        className="startup-card_btn self-end disabled:opacity-40"
                    >
                        Post
                    </button>
                </form>
            ) : (
                <p className="text-sm text-gray-500 italic">Sign in to leave a comment.</p>
            )}

            {/* Comments list */}
            {comments.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No comments yet. Be the first!</p>
            ) : (
                <ul className="space-y-5">
                    {comments.map((comment) => (
                        <li key={comment._id} className="border-[3px] border-black rounded-2xl p-4 space-y-3 bg-white">
                            {/* Comment Author */}
                            <div className="flex items-start gap-3">
                                {comment.author.image ? (
                                    <Image
                                        src={comment.author.image}
                                        alt={comment.author.name}
                                        width={36}
                                        height={36}
                                        className="rounded-full border-2 border-black shrink-0"
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-primary-100 border-2 border-black flex items-center justify-center font-bold text-sm shrink-0">
                                        {comment.author.name?.[0] ?? "?"}
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm">{comment.author.name}</span>
                                        {comment.author._id === startupOwnerId && (
                                            <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-bold">Owner</span>
                                        )}
                                        <span className="text-xs text-gray-400">{timeAgo(comment._createdAt)}</span>
                                    </div>
                                    <p className="text-sm mt-1 text-gray-800 break-words">{comment.content}</p>
                                </div>
                            </div>

                            {/* Reply button */}
                            {sessionUserId && (
                                <button
                                    onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                                    className="ml-12 text-xs font-bold text-primary hover:underline"
                                >
                                    {replyingTo === comment._id ? "Cancel" : "↩ Reply"}
                                </button>
                            )}

                            {/* Reply form */}
                            {replyingTo === comment._id && (
                                <form onSubmit={(e) => handleSubmitReply(e, comment._id)} className="ml-12 flex gap-2 mt-2">
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Write a reply..."
                                        rows={2}
                                        className="flex-1 border-[3px] border-black rounded-xl p-2 text-sm font-work-sans resize-none outline-none focus:border-primary"
                                    />
                                    <button type="submit" disabled={loading || !replyText.trim()} className="startup-card_btn self-end text-sm !py-2 disabled:opacity-40">
                                        Reply
                                    </button>
                                </form>
                            )}

                            {/* Replies */}
                            {comment.replies?.length > 0 && (
                                <ul className="ml-12 space-y-3 border-l-[3px] border-dashed border-black pl-4">
                                    {comment.replies.map((reply) => (
                                        <li key={reply._id} className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-primary-100 border-2 border-black flex items-center justify-center font-bold text-xs shrink-0">
                                                    {reply.author.name?.[0] ?? "?"}
                                                </div>
                                                <span className="font-bold text-sm">{reply.author.name}</span>
                                                {reply.author._id === startupOwnerId && (
                                                    <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-bold">Owner</span>
                                                )}
                                                <span className="text-xs text-gray-400">{timeAgo(reply._createdAt)}</span>
                                            </div>
                                            <p className="text-sm text-gray-700 ml-9 break-words">{reply.content}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
