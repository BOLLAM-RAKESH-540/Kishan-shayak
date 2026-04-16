import { Request, Response } from 'express';
import prisma from '../utils/prisma';


export const createPost = async (req: Request, res: Response) => {
  try {
    const { content, cropTag, location } = req.body;
    const phoneNumber = (req as any).phoneNumber;

    if (!phoneNumber) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const imageUrl = req.file ? req.file.path.replace(/\\/g, '/') : null;

    const post = await prisma.communityPost.create({
      data: {
        userId: phoneNumber,
        content,
        imageUrl,
        cropTag,
        location,
      },
      include: {
        user: {
          select: {
            name: true,
            profileImage: true,
            location: true,
          }
        }
      }
    });

    res.status(201).json(post);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeed = async (req: Request, res: Response) => {
  try {
    const { cropTag, location, page = '1', limit = '10' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const posts = await prisma.communityPost.findMany({
      where: {
        ...(cropTag && { cropTag: String(cropTag) }),
        ...(location && { location: { contains: String(location), mode: 'insensitive' } }),
      },
      include: {
        user: {
          select: {
            name: true,
            profileImage: true,
            location: true,
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          }
        },
        likes: {
          where: {
            userId: (req as any).phoneNumber || '',
          },
          select: {
            id: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take,
    });

    const totalPosts = await prisma.communityPost.count({
      where: {
        ...(cropTag && { cropTag: String(cropTag) }),
        ...(location && { location: { contains: String(location), mode: 'insensitive' } }),
      }
    });

    // Format to include isLiked boolean
    const formattedPosts = posts.map(post => ({
      ...post,
      isLiked: post.likes.length > 0,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
    }));

    res.json({
      posts: formattedPosts,
      metadata: {
        totalPosts,
        currentPage: Number(page),
        totalPages: Math.ceil(totalPosts / Number(limit)),
        hasMore: skip + take < totalPosts
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleLike = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const phoneNumber = (req as any).phoneNumber;

    if (!phoneNumber) return res.status(401).json({ message: 'Unauthorized' });

    const existingLike = await prisma.communityLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: phoneNumber,
        }
      }
    });

    if (existingLike) {
      await prisma.communityLike.delete({
        where: { id: existingLike.id }
      });
      res.json({ liked: false });
    } else {
      await prisma.communityLike.create({
        data: {
          postId,
          userId: phoneNumber,
        }
      });
      res.json({ liked: true });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const phoneNumber = (req as any).phoneNumber;

    if (!phoneNumber) return res.status(401).json({ message: 'Unauthorized' });
    if (!content) return res.status(400).json({ message: 'Comment content is required' });

    const comment = await prisma.communityComment.create({
      data: {
        postId,
        userId: phoneNumber,
        content,
      },
      include: {
        user: {
          select: {
            name: true,
            profileImage: true,
          }
        }
      }
    });

    res.status(201).json(comment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const comments = await prisma.communityComment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            name: true,
            profileImage: true,
          }
        }
      },
      orderBy: {
        createdAt: 'asc',
      }
    });

    res.json(comments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
