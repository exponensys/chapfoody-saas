import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  MessageCircle,
  Reply,
  ThumbsUp,
  ThumbsDown,
  Flag,
  MoreVertical,
  Send,
  Heart,
  Share2,
  Edit,
  Trash2,
  AlertTriangle,
  Shield
} from "lucide-react";

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    role?: string;
    verified?: boolean;
  };
  content: string;
  publishedAt: string;
  likes: number;
  dislikes: number;
  replies: Comment[];
  isEdited: boolean;
  isReported: boolean;
  status: "approved" | "pending" | "rejected";
}

interface CommentSystemProps {
  articleId: string;
  initialComments?: Comment[];
  allowAnonymous?: boolean;
  moderationEnabled?: boolean;
  currentUser?: {
    name: string;
    avatar: string;
    role?: string;
  };
}

export function CommentSystem({ 
  articleId, 
  initialComments = [], 
  allowAnonymous = true,
  moderationEnabled = true,
  currentUser 
}: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments.length > 0 ? initialComments : [
    {
      id: "1",
      author: {
        name: "Marie Dubois",
        avatar: "/api/placeholder/40/40",
        role: "Restauratrice",
        verified: true
      },
      content: "Excellente analyse ! Nous avons justement implémenté une solution d'IA dans notre chaîne de restaurants et les résultats sont impressionnants. Une augmentation de 35% de l'efficacité en cuisine.",
      publishedAt: "Il y a 2 heures",
      likes: 12,
      dislikes: 0,
      replies: [
        {
          id: "1-1",
          author: {
            name: "Dr. Sophie Moreau",
            avatar: "/api/placeholder/40/40",
            role: "Auteure",
            verified: true
          },
          content: "Merci Marie ! C'est exactement le type de retour d'expérience qui illustre parfaitement les bénéfices concrets de ces technologies.",
          publishedAt: "Il y a 1 heure",
          likes: 5,
          dislikes: 0,
          replies: [],
          isEdited: false,
          isReported: false,
          status: "approved"
        }
      ],
      isEdited: false,
      isReported: false,
      status: "approved"
    },
    {
      id: "2",
      author: {
        name: "Pierre Leclerc",
        avatar: "/api/placeholder/40/40",
        role: "Développeur"
      },
      content: "Article très intéressant ! J'aimerais savoir si vous avez des recommandations spécifiques sur les plateformes d'IA à utiliser pour les petites entreprises ?",
      publishedAt: "Il y a 4 heures",
      likes: 8,
      dislikes: 1,
      replies: [],
      isEdited: false,
      isReported: false,
      status: "approved"
    },
    {
      id: "3",
      author: {
        name: "Anonyme",
        avatar: "/api/placeholder/40/40"
      },
      content: "Ce commentaire est en attente de modération car il contient potentiellement du contenu inapproprié.",
      publishedAt: "Il y a 30 minutes",
      likes: 0,
      dislikes: 3,
      replies: [],
      isEdited: false,
      isReported: true,
      status: "pending"
    }
  ]);

  const [newComment, setNewComment] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [showModerationPanel, setShowModerationPanel] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return (b.likes - b.dislikes) - (a.likes - a.dislikes);
      case "oldest":
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      default: // recent
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
  });

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: currentUser || {
        name: "Utilisateur anonyme",
        avatar: "/api/placeholder/40/40"
      },
      content: newComment,
      publishedAt: "À l'instant",
      likes: 0,
      dislikes: 0,
      replies: [],
      isEdited: false,
      isReported: false,
      status: moderationEnabled ? "pending" : "approved"
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

  const handleReply = (parentId: string) => {
    if (!replyContent.trim()) return;

    const reply: Comment = {
      id: `${parentId}-${Date.now()}`,
      author: currentUser || {
        name: "Utilisateur anonyme",
        avatar: "/api/placeholder/40/40"
      },
      content: replyContent,
      publishedAt: "À l'instant",
      likes: 0,
      dislikes: 0,
      replies: [],
      isEdited: false,
      isReported: false,
      status: moderationEnabled ? "pending" : "approved"
    };

    setComments(comments.map(comment => 
      comment.id === parentId 
        ? { ...comment, replies: [...comment.replies, reply] }
        : comment
    ));

    setReplyContent("");
    setReplyingTo(null);
  };

  const handleLike = (commentId: string, isReply: boolean = false, parentId?: string) => {
    if (isReply && parentId) {
      setComments(comments.map(comment => 
        comment.id === parentId
          ? {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === commentId
                  ? { ...reply, likes: reply.likes + 1 }
                  : reply
              )
            }
          : comment
      ));
    } else {
      setComments(comments.map(comment =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      ));
    }
  };

  const handleReport = (commentId: string) => {
    setComments(comments.map(comment =>
      comment.id === commentId
        ? { ...comment, isReported: true, status: "pending" }
        : comment
    ));
  };

  const renderComment = (comment: Comment, isReply: boolean = false, parentId?: string) => {
    if (comment.status === "rejected") return null;

    return (
      <motion.div
        key={comment.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${isReply ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}
      >
        <Card className={`mb-4 ${comment.status === "pending" ? 'opacity-60 border-yellow-200' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                  <AvatarFallback>
                    {comment.author.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{comment.author.name}</span>
                    {comment.author.verified && (
                      <Badge className="bg-blue-100 text-blue-800">
                        <Shield className="w-3 h-3 mr-1" />
                        Vérifié
                      </Badge>
                    )}
                    {comment.author.role && (
                      <Badge variant="outline" className="text-xs">
                        {comment.author.role}
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{comment.publishedAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {comment.status === "pending" && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    En attente
                  </Badge>
                )}
                {comment.isReported && (
                  <Badge className="bg-red-100 text-red-800">
                    <Flag className="w-3 h-3 mr-1" />
                    Signalé
                  </Badge>
                )}
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-700 leading-relaxed">
                {comment.content}
                {comment.isEdited && (
                  <span className="text-sm text-gray-500 ml-2">(modifié)</span>
                )}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(comment.id, isReply, parentId)}
                  className="text-gray-500 hover:text-green-600"
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {comment.likes}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-red-600"
                >
                  <ThumbsDown className="w-4 h-4 mr-1" />
                  {comment.dislikes}
                </Button>

                {!isReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(comment.id)}
                    className="text-gray-500 hover:text-blue-600"
                  >
                    <Reply className="w-4 h-4 mr-1" />
                    Répondre
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-red-600"
                  onClick={() => handleReport(comment.id)}
                >
                  <Flag className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Reply Form */}
            {replyingTo === comment.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {currentUser?.name?.split(' ').map(n => n[0]).join('') || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Écrire une réponse..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReplyingTo(null)}
                      >
                        Annuler
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleReply(comment.id)}
                        className="bg-[#b70f23] hover:bg-[#70070e] text-white"
                      >
                        Répondre
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Render Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-2">
            {comment.replies.map(reply => renderComment(reply, true, comment.id))}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Comment Statistics */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2 text-[#b70f23]" />
          Commentaires ({comments.length})
        </h3>
        
        <div className="flex items-center gap-3">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Plus récents</SelectItem>
              <SelectItem value="popular">Plus populaires</SelectItem>
              <SelectItem value="oldest">Plus anciens</SelectItem>
            </SelectContent>
          </Select>

          {moderationEnabled && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowModerationPanel(!showModerationPanel)}
              className="border-yellow-400 text-yellow-700 hover:bg-yellow-50"
            >
              <Shield className="w-4 h-4 mr-1" />
              Modération
            </Button>
          )}
        </div>
      </div>

      {/* Moderation Panel */}
      {showModerationPanel && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <h4 className="font-medium text-yellow-800 mb-3">Panel de modération</h4>
              <div className="text-sm space-y-2">
                <p>• {comments.filter(c => c.status === "pending").length} commentaires en attente</p>
                <p>• {comments.filter(c => c.isReported).length} commentaires signalés</p>
                <p>• {comments.filter(c => c.status === "approved").length} commentaires approuvés</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* New Comment Form */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback>
                {currentUser?.name?.split(' ').map(n => n[0]).join('') || 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Partagez votre avis sur cet article..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <div className="flex items-center justify-between mt-3">
                <div className="text-sm text-gray-500">
                  {moderationEnabled && "Votre commentaire sera vérifié avant publication"}
                </div>
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                  className="bg-[#b70f23] hover:bg-[#70070e] text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Publier
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {sortedComments.map(comment => renderComment(comment))}
        
        {comments.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun commentaire pour le moment.</p>
            <p className="text-gray-400 text-sm">Soyez le premier à partager votre avis !</p>
          </div>
        )}
      </div>
    </div>
  );
}